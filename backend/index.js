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
// Hugging Face expects port 7860
const PORT = process.env.PORT || 7860;

/* =======================
   MIDDLEWARE
======================= */
// Add your Frontend URL to this list or use an Env Variable
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://shopease-ai-support.vercel.app",
  process.env.FRONTEND_URL // Allow dynamic frontend URL from env vars
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Optional: Allow all origins for testing if you are having trouble
        // callback(null, true); 
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("Backend API is running on Hugging Face 🚀");
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
    console.error("Database Error:", err);
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
    console.error("Handler Error:", err);
    res.status(500).json({ reply: "Server error occurred. Please try again." });
  }
});

/* =======================
   START SERVER
======================= */
try {
  initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
}