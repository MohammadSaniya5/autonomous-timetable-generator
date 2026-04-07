const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/addRoom", (req, res) => {

  const { room_name, capacity, type } = req.body;

  const sql = "INSERT INTO rooms (room_name, capacity, type) VALUES (?, ?, ?)";

  db.query(sql, [room_name, capacity, type], (err, result) => {

    if (err) {
      console.log(err);
      res.send("Error inserting room");
    } else {
      res.send("Room added successfully");
    }

  });

});

module.exports = router;