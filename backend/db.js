const Database = require("better-sqlite3");
const db = new Database("chat.db");

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
