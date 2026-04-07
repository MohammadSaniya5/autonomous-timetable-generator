const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/addSectionSubject",(req,res)=>{

const {section_id,subject_id,faculty_id,weekly_hours} = req.body;

db.query(
"INSERT INTO section_subjects (section_id,subject_id,faculty_id,weekly_hours) VALUES (?,?,?,?)",
[section_id,subject_id,faculty_id,weekly_hours],
(err,result)=>{
if(err) return res.send(err);
res.send("Mapping Added");
});

});

router.get("/sectionSubjects",(req,res)=>{

db.query("SELECT * FROM section_subjects",(err,result)=>{
if(err) return res.send(err);
res.json(result);
});

});

module.exports = router;