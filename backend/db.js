const Database = require("better-sqlite3");
const path = require("path");

// Check if running on Hugging Face (or if a DB_PATH env var is set)
// On HF, we will set DB_PATH to /data/chat.db
const dbPath = process.env.DB_PATH || "chat.db";

const db = new Database(dbPath);

function initDB() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      userName TEXT,
      createdAt TEXT
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversationId TEXT,
      sender TEXT,
      text TEXT,
      createdAt TEXT
    )
  `).run();
}

function run(sql, params = []) {
  return db.prepare(sql).run(params);
}

function all(sql, params = []) {
  return db.prepare(sql).all(params);
}

function get(sql, params = []) {
  return db.prepare(sql).get(params);
}

module.exports = {
  initDB,
  run,
  all,
  get
};