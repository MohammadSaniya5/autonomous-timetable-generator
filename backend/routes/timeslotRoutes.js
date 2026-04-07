const express = require("express");
const router = express.Router();
const db = require("../db");


router.post("/addTimeslot", (req, res) => {

    const { slot_time, slot_type } = req.body;

    db.query(
        "INSERT INTO timeslots (slot_time, slot_type) VALUES (?,?)",
        [slot_time, slot_type],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send("Error adding timeslot");
            } else {
                res.send("Timeslot added successfully");
            }

        });

});


router.get("/getTimeslots", (req, res) => {

    db.query(
        "SELECT * FROM timeslots ORDER BY id ASC",
        (err, result) => {

            if (err) {
                res.send("Error fetching timeslots");
            } else {
                res.json(result);
            }

        });

});


router.delete("/deleteTimeslot/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM timeslots WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                res.send("Error deleting timeslot");
            } else {
                res.send("Timeslot deleted");
            }

        });

}); 
router.put("/updateTimeslot/:id", (req, res) => {

    const id = req.params.id;

    const { slot_time, slot_type } = req.body;

    db.query(
        "UPDATE timeslots SET slot_time=?, slot_type=? WHERE id=?",
        [slot_time, slot_type, id],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send("Error updating timeslot");
            } else {
                res.send("Timeslot updated successfully");
            }

        });

});

module.exports = router;