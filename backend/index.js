require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { initDB, run, all, get } = require("./db");
const { generateReply } = require("./groq");

const app = express();

/* =======================
   ENV CONFIG
======================= */
const PORT = process.env.PORT || 5000;

/* =======================
   MIDDLEWARE
======================= */

// ✅ CORS (local + deployed frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://shopease-ai-support.onrender.com", // optional (if frontend same domain)
      "https://your-frontend.vercel.app",        // 🔁 replace with actual frontend
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
  res.status(200).send("Backend API is running 🚀");
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

// ✅ CHAT HISTORY
app.get("/chat/history/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;

    const rows = all(
      `SELECT sender, text FROM messages 
       WHERE conversationId = ? 
       ORDER BY id ASC`,
      [sessionId]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("❌ History error:", err);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

// ✅ CHAT MESSAGE
app.post("/chat/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message?.trim()) {
      return res.json({ reply: "Please enter a valid message." });
    }

    const conversationId = sessionId || crypto.randomUUID();
    const now = new Date().toISOString();

    // create conversation if new
    if (!sessionId) {
      run(
        `INSERT INTO conversations (id, createdAt) VALUES (?, ?)`,
        [conversationId, now]
      );
    }

    // extract & store name
    const name = extractName(message);
    if (name) {
      run(
        `UPDATE conversations SET userName = ? WHERE id = ?`,
        [name, conversationId]
      );
    }

    // fetch stored name
    const convo = get(
      `SELECT userName FROM conversations WHERE id = ?`,
      [conversationId]
    );

    // fetch last messages for context
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

    // generate AI reply
    const reply = await generateReply(
      history,
      message,
      convo?.userName
    );

    // save user message
    run(
      `INSERT INTO messages (conversationId, sender, text, createdAt)
       VALUES (?, ?, ?, ?)`,
      [conversationId, "user", message, now]
    );

    // save AI message
    run(
      `INSERT INTO messages (conversationId, sender, text, createdAt)
       VALUES (?, ?, ?, ?)`,
      [conversationId, "ai", reply, new Date().toISOString()]
    );

    res.json({ reply, sessionId: conversationId });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

/* =======================
   START SERVER
======================= */
initDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
