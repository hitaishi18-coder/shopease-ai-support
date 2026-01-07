const { all } = require("./db");

// read all messages
const rows = all("SELECT * FROM messages");

console.log(rows);
