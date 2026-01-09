require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { initDB, run, all, get } = require("./db");
const { generateReply } = require("./groq");

const app = express();

/* =======================
   CONFIG
======================= */
const PORT = process.env.PORT || 5000;

/* =======================
   MIDDLEWARE
======================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://shopease-ai-support.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

/* =======================
   HELPERS
======================= */
function extractName(text) {
  const match = text.match(/my name is\s+([a-zA-Z]+)/i);
  return match ? match[1] : null;
}

/* =======================
   ROUTES
======================= */

// Chat history
app.get("/chat/history/:sessionId", (req, res) => {
  try {
    const rows = all(
      `SELECT sender, text FROM messages
       WHERE conversationId = ?
       ORDER BY id ASC`,
      [req.params.sessionId]
    );

    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Chat message
app.post("/chat/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message?.trim()) {
      return res.json({ reply: "Please enter a valid message." });
    }

    const conversationId = sessionId || crypto.randomUUID();
    const now = new Date().toISOString();

    if (!sessionId) {
      run(
        `INSERT INTO conversations (id, createdAt)
         VALUES (?, ?)`,
        [conversationId, now]
      );
    }

    const name = extractName(message);
    if (name) {
      run(
        `UPDATE conversations SET userName = ?
         WHERE id = ?`,
        [name, conversationId]
      );
    }

    const convo = get(
      `SELECT userName FROM conversations WHERE id = ?`,
      [conversationId]
    );

    const rows = all(
      `SELECT sender, text FROM messages
       WHERE conversationId = ?
       ORDER BY id DESC
       LIMIT 8`,
      [conversationId]
    );

    const history = (rows || []).reverse().map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const reply = await generateReply(
      history,
      message,
      convo?.userName
    );

    run(
      `INSERT INTO messages (conversationId, sender, text, createdAt)
       VALUES (?, ?, ?, ?)`,
      [conversationId, "user", message, now]
    );

    run(
      `INSERT INTO messages (conversationId, sender, text, createdAt)
       VALUES (?, ?, ?, ?)`,
      [conversationId, "ai", reply, new Date().toISOString()]
    );

    res.json({ reply, sessionId: conversationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

/* =======================
   START SERVER
======================= */
initDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
