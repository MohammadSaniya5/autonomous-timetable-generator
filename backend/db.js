const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "timetable_system"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed");
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

module.exports = db;