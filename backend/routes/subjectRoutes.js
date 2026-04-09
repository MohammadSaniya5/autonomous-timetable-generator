const express = require("express");
const router = express.Router();
const db = require("../db");
console.log("Subject routes loaded"); 
router.post("/addSubject", (req, res) => {
    const { name, weekly_hours, faculty_id, section_id, subject_type, year } = req.body;

    db.query(
        `INSERT INTO subjects 
(name,weekly_hours,faculty_id,section_id,subject_type,year)
VALUES (?,?,?,?,?,?)`,
        [name, weekly_hours, faculty_id, section_id, subject_type, year],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "Error adding subject" });
            } else {
                res.json({ message: "Subject added" });
            }
        });
});

router.get("/getSubjects", (req, res) => {
    const sql = `
SELECT 
subjects.id,
subjects.name,
subjects.weekly_hours,
subjects.subject_type,
subjects.year,
subjects.faculty_id,         
subjects.section_id,        
faculty.name AS faculty,
sections.section_name AS section
FROM subjects
JOIN faculty ON subjects.faculty_id = faculty.id
JOIN sections ON subjects.section_id = sections.id
`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error fetching subjects" });
        } else {
            res.json(result);
        }
    });
});

router.put("/updateSubject/:id", (req, res) => {
    const id = req.params.id;
    const { name, weekly_hours, faculty_id, section_id, subject_type, year } = req.body;

    db.query(
        `UPDATE subjects
SET name=?, weekly_hours=?, faculty_id=?, section_id=?, subject_type=?, year=?
WHERE id=?`,
        [name, weekly_hours, faculty_id, section_id, subject_type, year, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "Error updating subject" });
            } else {
                res.json({ message: "Subject updated successfully" });
            }
        });
});

router.delete("/deleteSubject/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM subjects WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "Error deleting subject" });
            } else {
                if (result.affectedRows === 0) {
                    res.json({ error: "Subject not found" });
                } else {
                    res.json({ message: "Subject deleted successfully" });
                }
            }
        });
});
module.exports = router;