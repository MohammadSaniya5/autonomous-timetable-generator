const express = require("express");
const router = express.Router();
const db = require("../db");

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

router.get("/generateTimetable", async (req, res) => {
    try {
        const year = req.query.year;

        if (!year) {
            return res.status(400).send("Year is required");
        }
 
        await db.promise().query(
            "DELETE FROM timetable WHERE year=?",
            [year]
        );
 
        const [sections] = await db.promise().query(
            "SELECT * FROM sections WHERE year=?",
            [year]
        );

        const [subjects] = await db.promise().query(
            "SELECT * FROM subjects WHERE year=?",
            [year]
        );

        const [slots] = await db.promise().query(
            "SELECT * FROM timeslots ORDER BY id"
        );

        const lectureSlots = slots.filter(
            s => s.slot_type.toLowerCase().trim() === "lecture"
        );
 
        let timetableMap = {};
        let inserts = [];
        let labPatternToggle = 0;
        let facultyBusy = {};
        let facultyDailyLoad = {};
        let subjectDailyCount = {};
        let sectionLabDay = {};

 

        const breakIndex = slots.findIndex(s =>
            s.slot_type.toLowerCase().includes("break")
        );

        const lunchIndex = slots.findIndex(s =>
            s.slot_type.toLowerCase().includes("lunch")
        );

        const lectureSlotsOnly = slots.filter(
            s => s.slot_type.toLowerCase() === "lecture"
        );

        for (const section of sections) {

            const labs = subjects.filter(
                s =>
                    s.section_id === section.id &&
                    s.subject_type.toLowerCase().trim() === "lab"
            );

            for (const lab of labs) {

                let hours = lab.weekly_hours;
 
                if (hours < 2) {

                    const day = "Saturday";
                    const reversed = [...lectureSlotsOnly].reverse();

                    for (let slot of reversed) {

                        let key = section.id + "_" + day + "_" + slot.id;
                        let fkey = lab.faculty_id + "_" + day + "_" + slot.id;

                        if (!timetableMap[key] && !facultyBusy[fkey]) {

                            timetableMap[key] = true;
                            facultyBusy[fkey] = true;

                            inserts.push([
                                lab.id,
                                lab.faculty_id,
                                slot.id,
                                section.id,
                                day,
                                year
                            ]);

                            break;
                        }
                    }

                    continue;
                }
 

                let placed = false;

                for (const day of days) {

                    if (sectionLabDay[section.id + "_" + day]) continue;


                    let possibleBlocks = [];

                    if (hours === 3) {

                        let patterns = [];
 
                        if (breakIndex !== -1) {
                            let beforeBreak = slots[breakIndex - 1];
                            let afterBreak1 = slots[breakIndex + 1];
                            let afterBreak2 = slots[breakIndex + 2];

                            if (beforeBreak && afterBreak1 && afterBreak2) {
                                patterns.push([
                                    beforeBreak,
                                    afterBreak1,
                                    afterBreak2
                                ]);
                            }
                        }
 
                        if (lunchIndex !== -1) {
                            let beforeLunch = slots[lunchIndex - 1];
                            let afterLunch1 = slots[lunchIndex + 1];
                            let afterLunch2 = slots[lunchIndex + 2];

                            if (beforeLunch && afterLunch1 && afterLunch2) {
                                patterns.push([
                                    beforeLunch,
                                    afterLunch1,
                                    afterLunch2
                                ]);
                            }
                        }
 
                        if (patterns.length > 0) {
                            possibleBlocks.push(
                                patterns[labPatternToggle % patterns.length]
                            );
                            labPatternToggle++;
                        }

                    } 
                    if (lunchIndex !== -1) {

                        let beforeLunch = slots[lunchIndex - 1];
                        let afterLunch1 = slots[lunchIndex + 1];
                        let afterLunch2 = slots[lunchIndex + 2];

                        if (beforeLunch && afterLunch1 && afterLunch2) {

                            possibleBlocks.push([
                                beforeLunch,
                                afterLunch1,
                                afterLunch2
                            ]);
                        }
                    }
 
                    if (hours !== 3) {
                        for (let i = 0; i <= lectureSlotsOnly.length - hours; i++) {
                            possibleBlocks.push(
                                lectureSlotsOnly.slice(i, i + hours)
                            );
                        }
                    }

                    for (let block of possibleBlocks) {

                        if (block.length !== hours) continue;

                        let canPlace = true;

                        for (let s of block) {

                            let key = section.id + "_" + day + "_" + s.id;
                            let fkey = lab.faculty_id + "_" + day + "_" + s.id;

                            if (timetableMap[key] || facultyBusy[fkey]) {
                                canPlace = false;
                                break;
                            }
                        }

                        if (!canPlace) continue; 

                        block.forEach(s => {

                            let key = section.id + "_" + day + "_" + s.id;

                            timetableMap[key] = true;
                            facultyBusy[lab.faculty_id + "_" + day + "_" + s.id] = true;

                            inserts.push([
                                lab.id,
                                lab.faculty_id,
                                s.id,
                                section.id,
                                day,
                                year
                            ]);

                        });

                        sectionLabDay[section.id + "_" + day] = true;
                        placed = true;
                        break;
                    }

                    if (placed) break;
                }
            }
        }

 

        for (const section of sections) {

            const theories = subjects.filter(
                s =>
                    s.section_id === section.id &&
                    s.subject_type.toLowerCase().trim() === "theory"
            );

            if (theories.length === 0) continue;

            let subjectPool = [];

            theories.forEach(sub => {
                for (let i = 0; i < sub.weekly_hours; i++) {
                    subjectPool.push(sub);
                }
            });

            let index = 0;

            for (const day of days) {

                for (const slot of lectureSlots) {

                    let key = section.id + "_" + day + "_" + slot.id;

                    if (timetableMap[key]) continue;

                    let tries = 0;

                    while (tries < 20) {

                        const sub = subjectPool[index % subjectPool.length];
                        index++;

                        let subjectKey = sub.id + "_" + day;
                        let facultyKeyDay = sub.faculty_id + "_" + day;
                        let facultyKeySlot = sub.faculty_id + "_" + day + "_" + slot.id;
 
                        if ((subjectDailyCount[subjectKey] || 0) >= 2) {
                            tries++;
                            continue;
                        }
 
                        if ((facultyDailyLoad[facultyKeyDay] || 0) >= 4) {
                            tries++;
                            continue;
                        }
 
                        if (facultyBusy[facultyKeySlot]) {
                            tries++;
                            continue;
                        }
 
                        const prevSlotIndex = lectureSlots.findIndex(s => s.id === slot.id) - 1;

                        if (prevSlotIndex >= 0) {
                            const prevSlot = lectureSlots[prevSlotIndex];
                            const prevKey = section.id + "_" + day + "_" + prevSlot.id;

                            const prevInsert = inserts.find(
                                i =>
                                    i[3] === section.id &&
                                    i[2] === prevSlot.id &&
                                    i[4] === day
                            );

                            if (prevInsert && prevInsert[0] === sub.id) {
                                tries++;
                                continue;
                            }
                        }
 
                        timetableMap[key] = true;
                        facultyBusy[facultyKeySlot] = true;

                        facultyDailyLoad[facultyKeyDay] =
                            (facultyDailyLoad[facultyKeyDay] || 0) + 1;

                        subjectDailyCount[subjectKey] =
                            (subjectDailyCount[subjectKey] || 0) + 1;

                        inserts.push([
                            sub.id,
                            sub.faculty_id,
                            slot.id,
                            section.id,
                            day,
                            year
                        ]);

                        break;
                    }
 
                    if (!timetableMap[key]) {

                        for (let sub of theories) {

                            let facultyKeySlot = sub.faculty_id + "_" + day + "_" + slot.id;

                            if (!facultyBusy[facultyKeySlot]) {

                                timetableMap[key] = true;
                                facultyBusy[facultyKeySlot] = true;

                                inserts.push([
                                    sub.id,
                                    sub.faculty_id,
                                    slot.id,
                                    section.id,
                                    day,
                                    year
                                ]);

                                break;
                            }
                        }
                    }
                }
            }
        }
 

        if (inserts.length > 0) {
            await db.promise().query(
                `INSERT INTO timetable
(subject_id,faculty_id,timeslot_id,section_id,day,year)
VALUES ?`,
                [inserts]
            );
        }

        res.send("Timetable Generated Successfully 🚀");

    } catch (err) {
        console.log(err);
        res.status(500).send("Error generating timetable");
    }
});
 

router.get("/getStudentTimetable/:sectionId", (req, res) => {

    const sectionId = req.params.sectionId;
    const year = req.query.year;

    const sql = `
SELECT
t.day,
ts.slot_time,
s.name AS subject,
s.subject_type,
t.room_id    
FROM timetable t
JOIN timeslots ts ON ts.id=t.timeslot_id
JOIN subjects s ON s.id=t.subject_id
WHERE t.section_id=? AND t.year=?
ORDER BY
FIELD(t.day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
ts.id
`;

    db.query(sql, [sectionId, year], (err, result) => {

        if (err) {
            return res.status(500).json({ error: "Error fetching timetable" });
        }

        res.json(result);
    });

});
router.post("/updateTimetable", async (req, res) => {

    try {

        const { timetable } = req.body;

        if (!timetable || timetable.length === 0) {
            return res.status(400).json({ message: "No timetable data" });
        }

        for (let entry of timetable) {
 
            const [sub] = await db.promise().query(
                `SELECT id, faculty_id, subject_type 
   FROM subjects 
   WHERE name=? AND year=? AND section_id=? LIMIT 1`,
                [entry.subject, entry.year, entry.section_id]
            );

            if (sub.length === 0) continue;

            const subjectId = sub[0].id;
            const facultyId = sub[0].faculty_id;

            await db.promise().query(
                `UPDATE timetable t
   JOIN timeslots ts ON ts.slot_time = ?
   SET t.subject_id=?, t.faculty_id=?, t.room_id=?
   WHERE t.section_id=? AND t.day=? AND ts.id = t.timeslot_id`,
                [
                    entry.slot_time,
                    subjectId,
                    facultyId,
                    entry.room_id || null,    
                    entry.section_id,
                    entry.day
                ]
            );

        }

        res.json({ message: "Timetable updated successfully " });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Update failed " });
    }

});
router.get("/getFullTimetable", async (req, res) => {
    try {

        const year = req.query.year;

        if (!year) {
            return res.status(400).json({ error: "Year is required" });
        }

        const [rows] = await db.promise().query(`
      SELECT 
  t.day,
  ts.slot_time,
  t.section_id,
  sub.name AS subject,
  f.name AS faculty,
  sub.subject_type,
  t.room_id    
FROM timetable t
JOIN timeslots ts ON t.timeslot_id = ts.id
JOIN sections s ON t.section_id = s.id
JOIN subjects sub ON t.subject_id = sub.id
JOIN faculty f ON sub.faculty_id = f.id
WHERE s.year = ?
    `, [year]);
 
        if (rows.length === 0) {
            return res.json({
                data: [],
                message: "Timetable Not Created "
            });
        }

        res.json({
            data: rows,
            message: "Timetable Loaded "
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
