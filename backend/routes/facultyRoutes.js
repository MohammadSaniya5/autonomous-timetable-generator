const express = require("express");
const router = express.Router();
const db = require("../db");
 
router.post("/addFaculty", (req, res) => {

  const { name, department, max_lectures_per_day } = req.body;

  const sql = "INSERT INTO faculty (name, department) VALUES (?, ?)";

  db.query(sql, [name, department], (err, result) => {

    if (err) {
      console.log(err);
      res.send("Error inserting faculty");
    } else {
      res.send("Faculty added successfully");
    }

  });

});
router.get("/getFaculty", (req, res) => {

  db.query("SELECT * FROM faculty", (err, result) => {

    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }

  });

});
router.delete("/deleteFaculty/:id", (req, res) => {

  const id = req.params.id;

  db.query("DELETE FROM faculty WHERE id=?", [id], (err, result) => {

    if (err) {
      res.send(err);
    } else {
      res.send("Faculty deleted successfully");
    }

  });

});
router.put("/updateFaculty/:id", (req, res) => {

  const id = req.params.id;
  const { name, department } = req.body;
  console.log(id, name, department);
  const sql = `
UPDATE faculty
SET name = ?, department = ?
WHERE id = ?
`;

  db.query(sql, [name, department, id], (err, result) => {

    if (err) {
      console.log(err);
      res.send("Error updating faculty");
    } else {
      res.send("Faculty updated successfully");
    }

  });

});

module.exports = router;