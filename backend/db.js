const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "maglev.proxy.rlwy.net",
  user: "root",
  password: "fcnhfjZDWaHWVmnUlxYxKqHcSkQMcgMy",
  database: "railway",
  port: 18677
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed", err);
  } else {
    console.log("✅ Connected to Railway MySQL database");
  }
});

module.exports = db;