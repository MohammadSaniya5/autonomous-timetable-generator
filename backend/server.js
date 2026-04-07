const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const facultyRoutes = require("./routes/facultyRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const roomRoutes = require("./routes/roomRoutes");
const timeslotRoutes = require("./routes/timeslotRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const generateRoutes = require("./routes/generateRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", facultyRoutes);
app.use("/api", subjectRoutes);
app.use("/api", roomRoutes);
app.use("/api", timeslotRoutes);
app.use("/api", timetableRoutes);
app.use("/api", sectionRoutes);
app.use("/api", generateRoutes);

app.get("/", (req, res) => {
  res.send("Autonomous Timetable Generator Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});