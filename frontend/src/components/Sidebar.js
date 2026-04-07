import React from "react";

function Sidebar({ setPage }) {

    return (

        <div style={{
            width: "220px",
            height: "100vh",
            background: "#1e293b",
            color: "white",
            padding: "20px"
        }}>

            <h2>Admin Panel</h2>

            <button onClick={() => setPage("faculty")}>Faculty</button><br /><br />
            <button onClick={() => setPage("subjects")}>Subjects</button><br /><br />
            <button onClick={() => setPage("rooms")}>Rooms</button><br /><br />
            <button onClick={() => setPage("timeslots")}>Timeslots</button><br /><br />
            <button onClick={() => setPage("sections")}>Sections</button><br /><br />
            <button onClick={() => setPage("timetable")}>Timetable</button>

        </div>

    );

}

export default Sidebar;