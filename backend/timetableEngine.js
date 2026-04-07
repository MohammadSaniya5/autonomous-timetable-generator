const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateTimetable(sections, subjects, slots) {

  let timetable = {};
  let facultyBusy = {};
  let subjectDailyCount = {};
  let subjectWeeklyRemaining = {};

  const lectureSlots = slots.filter(
    s => s.slot_type.toLowerCase().trim() === "lecture"
  );

 
  sections.forEach(sec => {

    timetable[sec.id] = {};

    days.forEach(day => {

      timetable[sec.id][day] = {};

      lectureSlots.forEach(slot => {
        timetable[sec.id][day][slot.id] = null;
      });

    });

  });

  subjects.forEach(sub => {
    subjectWeeklyRemaining[sub.id] = sub.weekly_hours;
  });
 

  subjects.filter(s =>
    s.subject_type === "lab" &&
    sections.some(sec => sec.id === s.section_id)
  )
    .forEach(lab => {

      const sectionId = lab.section_id;
      const facultyId = lab.faculty_id;

      const shuffledDays = shuffle([...days]);

      for (let day of shuffledDays) {

        for (let i = 0; i < lectureSlots.length - 2; i++) {

          let s1 = lectureSlots[i].id;
          let s2 = lectureSlots[i + 1].id;
          let s3 = lectureSlots[i + 2].id;

          let clash = false;

          [s1, s2, s3].forEach(slot => {

            let facultyKey = facultyId + "_" + day + "_" + slot;

            if (facultyBusy[facultyKey]) {
              clash = true;
            }

          });

          if (clash) continue;

          if (
            timetable[sectionId][day][s1] ||
            timetable[sectionId][day][s2] ||
            timetable[sectionId][day][s3]
          ) {
            continue;
          }
 

          [s1, s2, s3].forEach(slot => {

            timetable[sectionId][day][slot] = lab;

            facultyBusy[
              facultyId + "_" + day + "_" + slot
            ] = true;

          });

          subjectWeeklyRemaining[lab.id] -= 3;

          return;

        }

      }

    });
 

  subjects
    .filter(s =>
      s.subject_type.toLowerCase().trim() === "theory" &&
      sections.some(sec => sec.id === s.section_id)
    )
    .forEach(sub => {

      const sectionId = sub.section_id;
      const facultyId = sub.faculty_id;

      while (subjectWeeklyRemaining[sub.id] > 0) {

        let placed = false;

        const shuffledDays = shuffle([...days]);

        for (let day of shuffledDays) {

          let dailyKey = sub.id + "_" + day;

          let dailyCount = subjectDailyCount[dailyKey] || 0;

          if (dailyCount >= 2) continue;

          const shuffledSlots = shuffle([...lectureSlots]);

          for (let slot of shuffledSlots) {

            if (timetable[sectionId][day][slot.id])
              continue;
 

            const prevSlot = lectureSlots.find(s => s.id === slot.id - 1);

            if (prevSlot) {

              const prevSub = timetable[sectionId][day][prevSlot.id];

              if (prevSub && prevSub.id === sub.id) {
                continue;
              }

            }

            let facultyKey =
              facultyId + "_" + day + "_" + slot.id;

            if (facultyBusy[facultyKey])
              continue;
 

            timetable[sectionId][day][slot.id] = sub;

            facultyBusy[facultyKey] = true;

            subjectDailyCount[dailyKey] = dailyCount + 1;

            subjectWeeklyRemaining[sub.id]--;

            placed = true;

            break;

          }

          if (placed) break;

        }

        if (!placed) {
          break;
        }

      }

    });
 

  sections.forEach(section => {

    const sectionSubjects = subjects.filter(
      s => s.section_id === section.id && s.subject_type === "theory"
    );

    for (let day of days) {

      for (let slot of lectureSlots) {

        if (!timetable[section.id][day][slot.id]) {

          for (let sub of shuffle(sectionSubjects)) {

            let facultyKey =
              sub.faculty_id + "_" + day + "_" + slot.id;

            const prevSlot = lectureSlots.find(s => s.id === slot.id - 1);

            if (prevSlot) {
              const prevSub =
                timetable[section.id][day][prevSlot.id];

              if (prevSub && prevSub.id === sub.id)
                continue;
            } 

            timetable[section.id][day][slot.id] = sub;

            facultyBusy[facultyKey] = true;

            break;

          }

        }

      }

    }

  });

  return timetable;

}

module.exports = generateTimetable;