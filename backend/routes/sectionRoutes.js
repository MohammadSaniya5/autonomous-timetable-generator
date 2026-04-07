const express = require("express");
const router = express.Router();
const db = require("../db");

 
router.post("/addSection", (req, res) => {

  const { section_name, year, classroom, lab_room } = req.body;

  db.query(
    "INSERT INTO sections (section_name,year,classroom,lab_room) VALUES (?,?,?,?)",
    [section_name, year, classroom, lab_room],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error adding section");
      } else {
        res.send("Section added");
      }

    });

}); 
router.put("/updateSection/:id", (req, res) => {

  const id = req.params.id;
  const { section_name, classroom, lab_room } = req.body;

  db.query(
    "UPDATE sections SET section_name=?, classroom=?, lab_room=? WHERE id=?",
    [section_name, classroom, lab_room, id],
    (err, result) => {

      if (err) {
        res.send("Error updating section");
      } else {
        res.send("Section updated successfully");
      }

    });

});
 
router.get("/getSections", (req, res) => {

  db.query("SELECT * FROM sections ORDER BY year, section_name", (err, result) => {

    if (err) {
      res.send("Error fetching sections");
    } else {
      res.json(result);
    }

  });

});

 
router.delete("/deleteSection/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM sections WHERE id=?",
    [id],
    (err, result) => {

      if (err) {
        res.send("Error deleting section");
      } else {
        res.send("Section deleted");
      }

    }
  );

});

module.exports = router; ""