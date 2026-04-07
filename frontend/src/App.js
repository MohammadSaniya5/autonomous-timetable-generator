import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [maxLectures, setMaxLectures] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [roomType, setRoomType] = useState("");
  const [day, setDay] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [timeslots, setTimeslots] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionEditId, setSectionEditId] = useState(null);
  const [isSectionEditing, setIsSectionEditing] = useState(false);
  const [sectionId, setSectionId] = useState("");
  const [studentTimetable, setStudentTimetable] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [page, setPage] = useState("home");
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [facultyDropdown, setFacultyDropdown] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState("");
  const [classroom, setClassroom] = useState("");
  const [labRoom, setLabRoom] = useState("");
  const [subjectType, setSubjectType] = useState("theory");
  const [year, setYear] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTimetable, setEditableTimetable] = useState([]);
  const [masterTimetable, setMasterTimetable] = useState([])
  const [editTimeslotId, setEditTimeslotId] = useState(null)
  const [isEditingTimeslot, setIsEditingTimeslot] = useState(false)
  const [selectedYear, setSelectedYear] = useState("");
  const showNotification = (message) => {

    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);

  };
  const fetchFaculty = async () => {

    const res = await fetch("http://localhost:5000/api/getFaculty");

    const data = await res.json();

    setFacultyList(data);

  };
  const addFaculty = async () => {

    const response = await fetch("http://localhost:5000/api/addFaculty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        department: department,
        max_lectures_per_day: maxLectures
      })
    });

    const data = await response.text();

    showNotification(data);

    setName("");
    setDepartment("");
    setMaxLectures("");

    fetchFaculty();

  };
  const startEdit = (faculty) => {
    setEditId(faculty.id);
    setName(faculty.name);
    setDepartment(faculty.department);
    setMaxLectures(faculty.max_lectures_per_day);
    setIsEditing(true);

    showNotification("⬆ Scroll up to edit");
  };
  const fetchTimeslots = async () => {

    const res = await fetch("http://localhost:5000/api/getTimeslots");

    const data = await res.json();

    setTimeslots(data);

  };

  function editTimeslot(id) {

    const slot = timeslots.find(s => s.id === id)

    if (!slot) return

    setSlotTime(slot.slot_time)
    setRoomType(slot.slot_type)

    setEditTimeslotId(id)
    setIsEditingTimeslot(true)

  }
  const fetchFullTimetable = async () => {

    if (!selectedYear) {
      showNotification("Please select year");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/getFullTimetable?year=${selectedYear}`
    );

    const result = await res.json();
    setMasterTimetable(result.data || []);
    if (result.message) {
      showNotification(result.message);
    }
  };
  const updateFaculty = async () => {

    await fetch(`http://localhost:5000/api/updateFaculty/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        department: department,
        max_lectures_per_day: maxLectures
      })
    });

    showNotification("Faculty updated successfully");

    setName("");
    setDepartment("");
    setMaxLectures("");

    setIsEditing(false);

    fetchFaculty();

  };
  const deleteSection = async (id) => {

    const res = await fetch(`http://localhost:5000/api/deleteSection/${id}`, {
      method: "DELETE"
    });

    const data = await res.text();

    showNotification(data);

    fetchSections();

  };
  const startEditSection = (section) => {
    setSectionEditId(section.id);
    setSectionName(section.section_name);
    setClassroom(section.classroom);
    setLabRoom(section.lab_room);
    setIsSectionEditing(true);

    showNotification("⬆ Scroll up to edit");

  };
  const updateSection = async () => {

    await fetch(`http://localhost:5000/api/updateSection/${sectionEditId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        section_name: sectionName,
        classroom: classroom,
        lab_room: labRoom
      })
    });

    showNotification("Section updated successfully");

    setSectionName("");
    setIsSectionEditing(false);

    fetchSections();

  };
  const fetchFacultyDropdown = async () => {
    const res = await fetch("http://localhost:5000/api/getFaculty");
    const data = await res.json();
    setFacultyDropdown(data);
  };
  const updateSlot = (day, time, value, roomId) => {

    const updated = editableTimetable.map(t => {
      if (t.day === day && t.slot_time === time) {
        return {
          ...t,
          subject: value,
          room_id: roomId || t.room_id
        };
      }
      return t;
    });

    setEditableTimetable(updated);
  };
  function editSubject(id) {
    const sub = subjects.find(s => s.id === id);
    if (!sub) return;

    setSubjectName(sub.name);
    setFacultyId(sub.faculty_id);
    setSectionId(sub.section_id);
    setSubjectType(sub.subject_type);
    setWeeklyHours(sub.weekly_hours);
    setYear(sub.year);
    setEditId(sub.id);
    setIsEditing(true);

    showNotification("⬆ Scroll up to edit ");

  }
  const viewTimetable = async () => {

    if (!selectedSection) {
      showNotification("Please select a section");
      return;
    }

    if (timeslots.length === 0) {
      showNotification("Please add timeslots first");
      return;
    }
    if (!year) {
      showNotification("Please select year");
      return;
    }
    const res = await fetch(
      `http://localhost:5000/api/getStudentTimetable/${selectedSection}?year=${year}`
    );

    const data = await res.json();

    if (data.length === 0) {
      showNotification("Timetable not generated yet");
      return;
    }

    setStudentTimetable(data);
    setEditableTimetable(
      data.map(slot => ({
        ...slot,
        section_id: selectedSection,
        year: year
      }))
    );
    const uniqueDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const uniqueTimes = timeslots.map(t => t.slot_time);

    setDays(uniqueDays);
    setTimes(uniqueTimes);

  };
  const addRoom = async () => {

    const response = await fetch("http://localhost:5000/api/addRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        room_name: roomName,
        capacity: capacity,
        type: roomType
      })
    });

    const data = await response.text();
    showNotification(data);

    setRoomName("");
    setCapacity("");
    setRoomType("");
  };
  const addSection = async () => {

    const response = await fetch("http://localhost:5000/api/addSection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        section_name: sectionName,
        classroom: classroom,
        lab_room: labRoom,
        year: year
      })
    });

    const data = await response.text();
    showNotification(data);

    setSectionName("");
    setClassroom("");
    setLabRoom("");

    fetchSections();
  };
  const fetchSections = async () => {

    const res = await fetch("http://localhost:5000/api/getSections");

    const data = await res.json();

    setSections(Array.isArray(data) ? data : []);

  };
  useEffect(() => {
    fetchFaculty();
    fetchTimeslots();
    fetchSubjects();
    fetchSections();
  }, []);

  useEffect(() => {

    if (page === "sections" && year) {
      fetchSections();
    }

  }, [page, year]);
  useEffect(() => {

    if (page === "subjects") {
      fetchSubjects();
      fetchFacultyDropdown();
    }

    if (page === "subjects" && year) {
      fetchSections();
    }

  }, [page, year]);
  useEffect(() => {

    if (page === "print") {
      fetchTimeslots();
    }

  }, [page, selectedYear]);
  useEffect(() => {
    if (page === "view") {
      document.body.classList.add("student-print-mode");
    } else {
      document.body.classList.remove("student-print-mode");
    }
  }, [page]);
  const deleteFaculty = async (id) => {

    const res = await fetch(`http://localhost:5000/api/deleteFaculty/${id}`, {
      method: "DELETE"
    });

    const data = await res.text();

    showNotification(data);

    fetchFaculty();

  };
  const fetchSubjects = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/getSubjects");
      const data = await res.json();

      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        setSubjects([]);
      }

    } catch (error) {
      console.log("Error fetching subjects:", error);
      setSubjects([]);
    }
  };
  const addSubject = async () => {

    if (!subjectName || !facultyId || !sectionId || !weeklyHours) {
      showNotification("Please fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/addSubject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: subjectName,
        weekly_hours: weeklyHours,
        faculty_id: facultyId,
        section_id: sectionId,
        subject_type: subjectType,
        year: year
      })
    });

    const data = await res.text();

    showNotification(data);

    setSubjectName("");
    setWeeklyHours("");
    setFacultyId("");
    setSectionId("");

    fetchSubjects();

  };
  const updateSubject = async () => {

    const res = await fetch(
      `http://localhost:5000/api/updateSubject/${editId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: subjectName,
          weekly_hours: weeklyHours,
          faculty_id: facultyId,
          section_id: sectionId,
          subject_type: subjectType,
          year: year
        })
      }
    );

    const data = await res.text();

    showNotification(data);

    setIsEditing(false);
    setEditId(null);

    setSubjectName("");
    setWeeklyHours("");
    setFacultyId("");
    setSectionId("");

    fetchSubjects();

  };
  function editTimeslot(id) {
    const slot = timeslots.find(s => s.id === id);
    if (!slot) return;

    setSlotTime(slot.slot_time);
    setRoomType(slot.slot_type);
    setEditTimeslotId(id);
    setIsEditingTimeslot(true);

    showNotification("⬆ Scroll up to edit");

  }
  const deleteSubject = async (id) => {

    if (!window.confirm("Delete this subject?")) return;

    await fetch(`http://localhost:5000/api/deleteSubject/${id}`, {
      method: "DELETE"
    });

    showNotification("Subject deleted");

    fetchSubjects();

  };
  const saveEditedTimetable = async () => {

    if (editableTimetable.length === 0) {
      showNotification("No timetable to save");
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/updateTimetable",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            timetable: editableTimetable
          })
        }
      );

      const data = await res.json();

      showNotification(data.message);

      viewTimetable();

    } catch (err) {

      showNotification("Update failed");

    }

  };
  const loadEditTimetable = async () => {

    if (!selectedSection || !year) {
      showNotification("Select Year and Section");
      return;
    }

    try {

      const res = await fetch(
        `http://localhost:5000/api/getStudentTimetable/${selectedSection}?year=${year}`
      );

      const data = await res.json();

      if (data.length === 0) {
        showNotification("No timetable found");
        return;
      }
      setEditableTimetable(
        data.map(slot => ({
          ...slot,
          section_id: selectedSection,
          year: year
        }))
      );

      const uniqueDays = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ];

      const uniqueTimes = timeslots.map(t => t.slot_time);

      setDays(uniqueDays);
      setTimes(uniqueTimes);

    } catch (err) {
      showNotification("Error loading timetable");
    }

  };
  const addTimeslot = async () => {

    if (!slotTime) {
      showNotification("Enter slot time");
      return;
    }

    await fetch("http://localhost:5000/api/addTimeslot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        slot_time: slotTime,
        slot_type: roomType
      })
    });

    showNotification("Timeslot added");

    setSlotTime("");
    setRoomType("lecture");

    fetchTimeslots();

  };
  const updateTimeslot = async () => {

    await fetch(
      `http://localhost:5000/api/updateTimeslot/${editTimeslotId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          slot_time: slotTime,
          slot_type: roomType
        })
      }
    )

    showNotification("Timeslot updated")

    setSlotTime("")
    setRoomType("lecture")

    setIsEditingTimeslot(false)

    fetchTimeslots()
    setEditTimeslotId(null)

  }
  const deleteTimeslot = async (id) => {

    await fetch(`http://localhost:5000/api/deleteTimeslot/${id}`, {
      method: "DELETE"
    });

    fetchTimeslots();

  };
  const generateTimetable = async () => {

    if (!year) {
      showNotification("Please select year first");
      return;
    }

    if (!window.confirm(
      "Generate timetable for Year " + year + " ?\n\nExisting timetable for this year will be replaced."
    )) {
      return;
    }

    setLoading(true);

    try {

      await fetch(
        `http://localhost:5000/api/generateTimetable?year=${year}`
      );

      showNotification("Timetable generated successfully");

    } catch (err) {

      showNotification("Error generating timetable");

    }

    setLoading(false);

  };
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }
  return (

    <div className="app-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          <h2>ATS</h2>
          <p>Autonomous Timetable</p>
        </div>

        <nav className="menu">

          <button onClick={() => setPage("home")}>Dashboard</button>
          <button onClick={() => setPage("faculty")}>Faculty</button>
          <button onClick={() => setPage("sections")}>Sections</button>
          <button onClick={() => setPage("subjects")}>Subjects</button>
          <button onClick={() => setPage("timeslots")}>Timeslots</button>
          <button onClick={() => setPage("view")}>Student Timetable</button>
          <button onClick={() => setPage("edit")}>Edit Timetable</button>
          <button onClick={() => setPage("print")}>Printable Timetable</button>


        </nav>

      </aside>


      {/* MAIN AREA */}

      <main className="main" >
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}

        {/* TOP HEADER */}

        <header className="topbar">

          <h1>Autonomous Timetable System</h1>

          <div className="admin-info">

            <span>Admin</span>

            <button
              className="logout-btn"
              onClick={() => setIsLoggedIn(false)}
            >
              Logout
            </button>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <section className="page">

          {page === "home" && (

            <div className="welcome">

              <h2>Welcome to the Academic Timetable Management Portal</h2>

              <p>
                This system enables administrators to manage faculty,
                subjects, rooms, sections and automatically generate
                optimized timetables for autonomous institutions.
              </p>

              <p>
                Use the navigation panel on the left to begin managing
                academic scheduling resources.
              </p>

            </div>

          )}


          {/* FACULTY */}

          {page === "faculty" && (

            <div class="page landscape-print">
              <div className="faculty-page">

                <h2>Faculty Management</h2>

                <div className="form-row">

                  <input
                    placeholder="Faculty Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />

                  {isEditing ? (

                    <button className="btn-add" onClick={updateFaculty}>
                      Update Faculty
                    </button>

                  ) : (

                    <button className="btn-add" onClick={addFaculty}>
                      Add Faculty
                    </button>

                  )}

                </div>

                <input
                  className="search-box"
                  placeholder="Search faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-print" onClick={() => window.print()}>
                  Print Faculty Data
                </button>
                <table className="data-table">

                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Faculty Name</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {facultyList.length === 0 ? (

                      <tr>
                        <td colSpan="5" className="empty-row">
                          No faculty records found
                        </td>
                      </tr>

                    ) : (

                      facultyList
                        .filter(f =>
                          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.department.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((f, index) => (
                          <tr key={f.id}>

                            <td>{index + 1}</td>
                            <td>{f.name}</td>
                            <td>{f.department}</td>

                            <td className="actions">

                              <button
                                className="btn-edit"
                                onClick={() => startEdit(f)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn-delete"
                                onClick={() => {
                                  if (window.confirm("Delete this faculty?")) {
                                    deleteFaculty(f.id)
                                  }
                                }}
                              >
                                Delete
                              </button>

                            </td>

                          </tr>
                        ))

                    )}

                  </tbody>

                </table>
              </div>
            </div>

          )}
          {page === "sections" && (

            <div>

              <h2>Section Management</h2>

              <div className="form-row">
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                <input
                  type="text"
                  placeholder="Section Name (A/B/C)"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                />
                <input
                  placeholder="Classroom (ex: R101)"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                />

                <input
                  placeholder="Lab Room (ex: 111a)"
                  value={labRoom}
                  onChange={(e) => setLabRoom(e.target.value)}
                />

                {isSectionEditing ? (

                  <button className="btn-add" onClick={updateSection}>
                    Update Section
                  </button>

                ) : (

                  <button className="btn-add" onClick={addSection}>
                    Add Section
                  </button>

                )}

              </div>

              <table className="data-table">

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Classroom</th>
                    <th>Lab Room</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {!sections || sections.length === 0 ? (

                    <tr>
                      <td colSpan="3" className="empty-row">
                        No sections available
                      </td>
                    </tr>

                  ) : (

                    sections.map((s, index) => (

                      <tr key={s.id}>

                        <td>{index + 1}</td>
                        <td>{s.year}</td>
                        <td>{s.section_name}</td>
                        <td>{s.classroom}</td>
                        <td>{s.lab_room}</td>

                        <td className="actions">

                          <button
                            className="btn-edit"
                            onClick={() => startEditSection(s)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => {
                              if (window.confirm("Delete this section?")) {
                                deleteSection(s.id)
                              }
                            }}
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}
          {page === "subjects" && (

            <div className="subjects-page">
              <div class="page landscape-print">
                <h2>Subject Management</h2>

                <div className="form-row">
                  <input type="hidden" id="subjectId"></input>
                  <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>                <input
                    placeholder="Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />

                  <select
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                  >

                    <option value="">Select Faculty</option>

                    {facultyDropdown.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}

                  </select>

                  <select
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                  >

                    <option value="">Select Section</option>

                    {sections
                      .filter(s => s.year == year)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.section_name}
                        </option>
                      ))}

                  </select>

                  <input
                    type="number"
                    placeholder="Lectures Per Week"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                  />
                  <select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                  >

                    <option value="theory">Theory</option>
                    <option value="lab">Lab</option>

                  </select>

                  <button
                    className="btn-add"
                    onClick={isEditing ? updateSubject : addSubject}
                  >
                    {isEditing ? "Update Subject" : "Add Subject"}
                  </button>

                </div>


                <table className="data-table1">

                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Year</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Faculty</th>
                      <th>Section</th>
                      <th>Hours / Week</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {subjects.length === 0 ? (

                      <tr>
                        <td colSpan="6" className="empty-row">
                          No subjects available
                        </td>
                      </tr>

                    ) : (

                      subjects.map((sub, index) => (

                        <tr key={sub.id}>

                          <td>{index + 1}</td>
                          <td>{sub.year}</td>
                          <td>{sub.name}</td>
                          <td>{sub.subject_type}</td>
                          <td>{sub.faculty}</td>
                          <td>{sub.section}</td>
                          <td>{sub.weekly_hours}</td>

                          <td className="actions">

                            <button
                              className="btn-edit"
                              onClick={() => editSubject(sub.id)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn-delete"
                              onClick={() => deleteSubject(sub.id)}
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>
              </div>
              <button className="btn-print1" onClick={() => window.print()}>
                Print Subjects
              </button>
            </div>

          )}
          {page === "timeslots" && (

            <div>

              <h2>Add Timeslot</h2>
              <div className="form-row">
                <input
                  placeholder="Slot Time (Ex: 9:00-10:00)"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                />

                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >

                  <option value="lecture">Lecture</option>
                  <option value="break">Break</option>
                  <option value="lunch">Lunch</option>

                </select>
                <button
                  className="action-btn"
                  onClick={isEditingTimeslot ? updateTimeslot : addTimeslot}
                >
                  {isEditingTimeslot ? "Update Timeslot" : "Add Timeslot"}
                </button>
              </div>
              <br /><br />

              <h3>Timeslot List</h3>

              <table className="data-table">

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Slot Time</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {timeslots.length === 0 ? (

                    <tr>
                      <td colSpan="3" className="empty-row">
                        No timeslots available
                      </td>
                    </tr>

                  ) : (

                    timeslots.map((t, index) => (

                      <tr key={t.id}>

                        <td>{index + 1}</td>
                        <td>{t.slot_time}</td>
                        <td>{t.slot_type}</td>

                        <td className="actions">

                          <button
                            className="btn-edit"
                            onClick={() => editTimeslot(t.id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => deleteTimeslot(t.id)}
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))

                  )}



                </tbody>

              </table>

            </div>

          )}
          {/* GENERATE */}

          {page === "generate" && (

            <div className="generate-area">

              <h2>Generate Timetable</h2>

              <p>
                Click the button below to automatically generate
                a timetable based on faculty availability,
                subjects and timeslots.
              </p>

              <button
                className="primary-btn"
                onClick={generateTimetable}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Timetable"}
              </button>

            </div>

          )}
          {page === "view" && (

            <div>


              <div className="generate-section">

                <h2>Generate Timetable</h2>

                <p style={{ marginBottom: "10px" }}>
                  Before generating the timetable please make sure the following data is filled:
                </p>

                <ul style={{ textAlign: "left", marginBottom: "15px" }}>
                  <li>All Faculties are added</li>
                  <li>All Sections with Year are created</li>
                  <li>All Subjects are assigned with Faculty</li>
                  <li>Lecture and Lab hours are entered correctly</li>
                  <li>Time slots are configured</li>
                </ul>

                <p style={{ color: "red", fontWeight: "bold" }}>
                  ⚠ Generating timetable will delete the previous timetable and create a new one.
                </p>
                <select value={year} onChange={(e) => setYear(e.target.value)}>

                  <option value="">Select Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>

                </select>
                <button
                  className="primary-btn"
                  onClick={generateTimetable}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Timetable"}
                </button>

              </div>
              <hr style={{ margin: "30px 0" }} />
              <div class="page landscape-print">
                <h2>View Timetable</h2>
                <p>Select year and section to view timetable.</p>
                <div className="form-row">


                  <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>

                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >

                    <option value="">Select Section</option>

                    {sections
                      .filter(s => s.year == year)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.section_name}
                        </option>
                      ))}

                  </select>


                  <button className="btn-add" onClick={viewTimetable}>
                    View Timetable
                  </button>

                </div>

                <br />

                <div id="student-print">
                  <div className="print-only">
                    <h2>REGULAR TIMETABLE</h2>
                    <h4>
                      Year: {year} | Section: {
                        sections.find(s => s.id == selectedSection)?.section_name || ""
                      }
                    </h4>
                    <h3>
                      Room No: {
                        sections.find(s => s.id == selectedSection)?.classroom || ""
                      }
                    </h3>
                  </div>
                  {studentTimetable.length === 0 ? (

                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                      Please select Year and Section, then click "View Timetable"
                    </p>

                  ) : (
                    <table className="data-table">

                      <thead>

                        <tr>

                          <th>Day</th>

                          {times.map((time, index) => (
                            <th key={index}>{time}</th>
                          ))}

                        </tr>

                      </thead>

                      <tbody>

                        {days.map((day, index) => (

                          <tr key={index}>

                            <td>{day}</td>

                            {times.map((time, i) => {

                              const entry = studentTimetable.find(
                                t => t.day === day && t.slot_time === time
                              )

                              const slotInfo = timeslots.find(s => s.slot_time === time)
                              if (slotInfo?.slot_type === "break" && day === "Monday") {
                                return (

                                  <td key={i} rowSpan="6" className="break-cell">
                                    <div className="vertical">
                                      B<br />R<br />E<br />A<br />K
                                    </div>
                                  </td>
                                )
                              }

                              if (slotInfo?.slot_type === "break") {
                                return null
                              }
                              if (slotInfo?.slot_type === "lunch" && day === "Monday") {
                                return (

                                  <td key={i} rowSpan="6" className="lunch-cell">
                                    <div className="vertical">
                                      L<br />U<br />N<br />C<br />H
                                    </div>
                                  </td>
                                )
                              }

                              if (slotInfo?.slot_type === "lunch") {
                                return null
                              }


                              if (entry) {

                                let span = 1

                                for (let j = i + 1; j < times.length; j++) {

                                  const nextSlot = timeslots.find(s => s.slot_time === times[j])

                                  if (!nextSlot || nextSlot.slot_type !== "lecture") break

                                  const nextEntry = studentTimetable.find(
                                    t => t.day === day && t.slot_time === times[j]
                                  )

                                  if (!nextEntry) break

                                  if (nextEntry.subject !== entry.subject) break

                                  span++

                                }


                                const prevSlot = timeslots.find(s => s.slot_time === times[i - 1])

                                if (prevSlot) {

                                  const prevEntry = studentTimetable.find(
                                    t => t.day === day && t.slot_time === times[i - 1]
                                  )

                                  if (prevEntry && prevEntry.subject === entry.subject) {
                                    return null
                                  }

                                }

                                const currentSection = sections.find(s => s.id == selectedSection);

                                const isLab =
                                  entry.subject_type === "lab" ||
                                  entry.subject?.toLowerCase().includes("lab");

                                return (
                                  <td key={i} colSpan={span} className="lab-cell">
                                    {isLab ? (
                                      <span className="lab-text">
                                        &lt;--- {entry.subject} ({entry.room_id || currentSection?.lab_room}) ---&gt;
                                      </span>
                                    ) : (
                                      entry.subject
                                    )}
                                  </td>
                                );
                              }

                              return <td key={i}></td>

                            })}



                          </tr>

                        ))}

                      </tbody>

                    </table>

                  )}
                </div>
              </div>
              <div className="print-btn-wrapper">
                {studentTimetable.length > 0 && (
                  <button onClick={() => window.print()}>
                    Print
                  </button>
                )}
              </div>

            </div>

          )}
          {page === "edit" && (

            <div>

              <h2>Edit Timetable</h2>
              <div className="form-row">

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="">Select Section</option>

                  {sections
                    .filter(s => s.year == year)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.section_name}
                      </option>
                    ))}
                </select>

                <button onClick={loadEditTimetable} className="btn-add">
                  Load Timetable
                </button>

              </div>
              {editableTimetable.length === 0 ? (

                <p style={{ textAlign: "center", marginTop: "20px" }}>
                  Please select Year and Section, then click "Load Timetable"
                </p>

              ) : (
                <table className="edit-table">

                  <thead>
                    <tr>
                      <th>Day</th>
                      {times.map((time, index) => (
                        <th key={index}>{time}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>

                    {days.map((day, index) => (

                      <tr key={index}>

                        <td>{day}</td>

                        {times.map((time, i) => {

                          const entry = editableTimetable.find(
                            t => t.day === day && t.slot_time === time
                          );

                          const slotInfo = timeslots.find(s => s.slot_time === time);

                          if (slotInfo?.slot_type === "break" && day === "Monday") {
                            return (
                              <td key={i} rowSpan="6" className="break-cell">
                                <div className="vertical">
                                  B<br />R<br />E<br />A<br />K
                                </div>
                              </td>
                            );
                          }

                          if (slotInfo?.slot_type === "break") return null;

                          if (slotInfo?.slot_type === "lunch" && day === "Monday") {
                            return (
                              <td key={i} rowSpan="6" className="lunch-cell">
                                <div className="vertical">
                                  L<br />U<br />N<br />C<br />H
                                </div>
                              </td>
                            );
                          }

                          if (slotInfo?.slot_type === "lunch") return null;

                          return (
                            <td key={i}>
                              {/* SUBJECT SELECT */}
                              <select
                                value={entry ? entry.subject : ""}
                                onChange={(e) =>
                                  updateSlot(day, time, e.target.value, entry?.room_id)
                                }
                                style={{ width: "95%" }}
                              >
                                <option value="">Select Subject</option>
                                {subjects.map((sub) => (
                                  <option key={sub.id} value={sub.name}>
                                    {sub.name}
                                  </option>
                                ))}
                              </select>

                              {/*  ROOM INPUT (NEW) */}
                              {(entry?.subject_type === "lab" ||
                                entry?.subject?.toLowerCase().includes("lab")) && (
                                  <input
                                    type="text"
                                    placeholder="Lab Room"
                                    value={entry?.room_id || ""}
                                    onChange={(e) =>
                                      updateSlot(day, time, entry?.subject, e.target.value)
                                    }
                                    style={{
                                      width: "90%",
                                      marginTop: "3px",
                                      marginBottom: "-10px",
                                      fontSize: "10px"
                                    }}
                                  />
                                )}
                            </td>
                          );

                        })}

                      </tr>

                    ))}

                  </tbody>
                </table>
              )}
              <center>
                {editableTimetable.length > 0 && (
                  <button onClick={saveEditedTimetable} className="save-btn">
                    Save Changes
                  </button>
                )}

              </center>


            </div>

          )}
          {page === "print" && (

            <div id="print-section" className="timetable-page">
              <div className="form-row">

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >

                  <option value="">Select Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>

                </select>

                <button
                  className="btn-add"
                  onClick={async () => {
                    await fetchFullTimetable();
                    await fetchSections();
                  }}
                >
                  View Timetable
                </button>

              </div>
              <div className="print-header">

                <img
                  src="/logo.png"
                  alt="College Logo"
                  className="print-logo"
                />

                <div className="print-header-text">

                  <h1>VIGNAN'S INSTITUTE OF INFORMATION TECHNOLOGY</h1>

                  <h3>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</h3>

                  <h3>CLASS TIMETABLE</h3>

                  <h4>Academic Year 2025 - 2026</h4>

                </div>

              </div>
              <h3 className="print-year">
                Year: {selectedYear}
              </h3>
              <h2>Regular Timetable</h2>

              {sections
                .filter(section => Number(section.year) === Number(selectedYear))
                .map(section => {

                  const sectionData = masterTimetable.filter(
                    t => t.section_id === section.id
                  )
                  if (sectionData.length === 0) return null;
                  return (

                    <div key={section.id} className="print-section">

                      <h3>
                        SECTION : {section.section_name} &nbsp;&nbsp;&nbsp;
                        ROOM NO : {section.classroom}
                      </h3>

                      <table className="print-table">

                        <thead>

                          <tr>

                            <th>DAY</th>

                            {timeslots.map(slot => (
                              <th key={slot.id}>{slot.slot_time}</th>
                            ))}

                          </tr>

                        </thead>

                        <tbody>

                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => {

                            return (

                              <tr key={day}>

                                <td>{day}</td>

                                {timeslots.map((slot, i) => {

                                  const entry = sectionData.find(
                                    t => t.day === day && t.slot_time === slot.slot_time
                                  )


                                  if (slot.slot_type === "break" && day === "Monday") {
                                    return (
                                      <td key={slot.id} rowSpan="6" className="break-cell">
                                        <div className="vertical">
                                          B<br />R<br />E<br />A<br />K
                                        </div>
                                      </td>
                                    )
                                  }

                                  if (slot.slot_type === "break") return null


                                  if (slot.slot_type === "lunch" && day === "Monday") {
                                    return (
                                      <td key={slot.id} rowSpan="6" className="lunch-cell">
                                        <div className="vertical">
                                          L<br />U<br />N<br />C<br />H
                                        </div>
                                      </td>
                                    )
                                  }

                                  if (slot.slot_type === "lunch") return null


                                  if (entry) {

                                    let span = 1

                                    for (let j = i + 1; j < timeslots.length; j++) {

                                      const nextSlot = timeslots[j]

                                      if (nextSlot.slot_type !== "lecture") break

                                      const nextEntry = sectionData.find(
                                        t => t.day === day && t.slot_time === nextSlot.slot_time
                                      )

                                      if (!nextEntry) break

                                      if (nextEntry.subject !== entry.subject) break

                                      span++

                                    }


                                    const prevSlot = timeslots[i - 1]

                                    if (prevSlot) {

                                      const prevEntry = sectionData.find(
                                        t => t.day === day && t.slot_time === prevSlot.slot_time
                                      )

                                      if (prevEntry && prevEntry.subject === entry.subject) {
                                        return null
                                      }

                                    }

                                    const isLab =
                                      entry.subject_type === "lab" ||
                                      entry.subject?.toLowerCase().includes("lab");

                                    return (
                                      <td key={slot.id} colSpan={span} className="lab-cell">
                                        {isLab ? (
                                          <span className="lab-text">
                                            &lt;--- {entry.subject} ({entry.room_id || section.lab_room}) ---&gt;
                                          </span>
                                        ) : (
                                          entry.subject
                                        )}
                                      </td>
                                    );

                                  }

                                  return <td key={slot.id}></td>

                                })}

                              </tr>

                            )

                          })}

                        </tbody>

                      </table>

                    </div>

                  )

                })}
              {masterTimetable.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                  Please select year and click "View Timetable"
                </p>
              )}
              {masterTimetable.length > 0 && (
                <>
                  <h2 style={{ marginTop: "40px" }}>Faculty Allocation</h2>

                  <table className="print-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        {sections
                          .filter(s => Number(s.year) === Number(selectedYear))
                          .map(sec => (
                            <th key={sec.id}>{sec.section_name}</th>
                          ))}
                      </tr>
                    </thead>

                    <tbody>
                      {
                        [ 
                          ...[
                            ...new Set(
                              masterTimetable
                                .filter(t => t.subject_type !== "lab")
                                .map(t => t.subject)
                            )
                          ],
 
                          ...[
                            ...new Set(
                              masterTimetable
                                .filter(t => t.subject_type === "lab")
                                .map(t => t.subject)
                            )
                          ]
                        ].map(subject => (
                          <tr key={subject}>
                            <td>{subject}</td>

                            {masterTimetable.length > 0 &&
                              sections
                                .filter(section => Number(section.year) === Number(selectedYear))
                                .map(section => {

                                  const entry = masterTimetable.find(
                                    t =>
                                      t.subject === subject &&
                                      t.section_id === section.id
                                  );

                                  return (
                                    <td key={section.id}>
                                      {entry ? entry.faculty : "-"}
                                    </td>
                                  );
                                })}

                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}
              <div className="print-footer">

                <div>Timetable Incharge</div>

                <div>Head of Department</div>

              </div>
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <button onClick={() => window.print()}>
                  Print Timetable
                </button>
              </div>
            </div>

          )}

        </section>

      </main>

    </div>

  );
}

export default App;