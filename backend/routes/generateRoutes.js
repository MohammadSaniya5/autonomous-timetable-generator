const express = require("express");
const router = express.Router();
const db = require("../db");
const generateTimetable = require("../timetableEngine");

router.get("/generateTimetable", async (req, res) => {

    try {

        const year = req.query.year;

        if (!year) {
            return res.status(400).send("Year required");
        }
 

        await db.promise().query(
            "DELETE FROM timetable WHERE year=?",
            [year]
        );

        const [sections] = await db.promise().query(
            "SELECT * FROM sections WHERE year=?",
            [year]
        );

        if (sections.length === 0) {
            return res.status(400).send("No sections found for this year");
        }

        const [subjects] = await db.promise().query(
            "SELECT * FROM subjects WHERE year=?",
            [year]
        );

        const [slots] = await db.promise().query(
            "SELECT * FROM timeslots ORDER BY id"
        );

        const timetable = generateTimetable(sections, subjects, slots);

        let rows = [];

        sections.forEach(section => {

            Object.keys(timetable[section.id]).forEach(day => {

                Object.keys(timetable[section.id][day]).forEach(slotId => {

                    const sub = timetable[section.id][day][slotId];

                    if (sub) {

                        rows.push([
                            sub.id,
                            sub.faculty_id,
                            section.id,
                            slotId,
                            day,
                            year
                        ]);

                    }

                });

            });

        });

        if (rows.length === 0) {
            return res.status(400).send("Timetable generation failed. Check subjects and faculty data.");
        }

        await db.promise().query(
            `INSERT INTO timetable
(subject_id,faculty_id,section_id,timeslot_id,day,year)
VALUES ?`,
            [rows]
        );

        res.send("Timetable Generated Successfully");

    } catch (err) {

        console.log(err);
        res.status(500).send("Generation Error");

    }

});

module.exports = router;