/* =========================================================
   PHILIP MODEL SCHOOL
   ATTENDANCE MANAGEMENT
   FIRESTORE VERSION
========================================================= */

import {
    collection,
    getDocs,
    doc,
    setDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


/* =========================================================
   DATA
========================================================= */

let students = [];
let attendanceRecords = [];


/* =========================================================
   ELEMENTS
========================================================= */

const attendanceSession =
    document.getElementById("attendanceSession");

const attendanceTerm =
    document.getElementById("attendanceTerm");

const attendanceClass =
    document.getElementById("attendanceClass");

const attendanceDate =
    document.getElementById("attendanceDate");

const loadAttendanceBtn =
    document.getElementById("loadAttendanceBtn");

const attendanceTableCard =
    document.getElementById("attendanceTableCard");

const attendanceSummaryCard =
    document.getElementById("attendanceSummaryCard");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const attendanceDateTitle =
    document.getElementById("attendanceDateTitle");

const markAllPresentBtn =
    document.getElementById("markAllPresentBtn");

const saveAttendanceBtn =
    document.getElementById("saveAttendanceBtn");

const summaryStudents =
    document.getElementById("summaryStudents");

const summaryPresent =
    document.getElementById("summaryPresent");

const summaryAbsent =
    document.getElementById("summaryAbsent");

const summaryLate =
    document.getElementById("summaryLate");


/* =========================================================
   SET TODAY'S DATE
========================================================= */

const today =
    new Date().toISOString().split("T")[0];

attendanceDate.value = today;


/* =========================================================
   LOAD CLASSES FROM FIRESTORE
========================================================= */

async function loadClasses() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "classes")
            );


        attendanceClass.innerHTML = `
            <option value="">
                Select Class
            </option>
        `;


        const classes = [];


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();

                if (
                    data.name &&
                    !classes.includes(data.name)
                ) {

                    classes.push(data.name);

                }

            }
        );


        classes.sort();


        classes.forEach(
            className => {

                const option =
                    document.createElement("option");

                option.value =
                    className;

                option.textContent =
                    className;

                attendanceClass.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading classes:",
            error
        );

        alert(
            "Unable to load classes from Firebase."
        );

    }

}


/* =========================================================
   LOAD STUDENTS FOR SELECTED CLASS
========================================================= */

async function loadStudents() {

    const selectedClass =
        attendanceClass.value;


    if (!selectedClass) {

        alert(
            "Please select a class."
        );

        return false;

    }


    try {

        const studentsSnapshot =
            await getDocs(
                collection(db, "students")
            );


        students = [];


        studentsSnapshot.forEach(
            documentSnapshot => {

                const student =
                    documentSnapshot.data();


                if (
                    student.class ===
                    selectedClass
                ) {

                    students.push({

                        firestoreId:
                            documentSnapshot.id,

                        ...student

                    });

                }

            }
        );


        students.sort(
            (a, b) => {

                const nameA =
                    `${a.firstName || ""} ${a.lastName || ""}`;

                const nameB =
                    `${b.firstName || ""} ${b.lastName || ""}`;

                return nameA.localeCompare(
                    nameB
                );

            }
        );


        if (students.length === 0) {

            alert(
                "No students found in this class."
            );

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );

        alert(
            "Unable to load students from Firebase."
        );

        return false;

    }

}


/* =========================================================
   GET TERM DATE RANGE
========================================================= */

function getTermDateRange(
    session,
    term
) {

    const [startYear] =
        session.split("/").map(Number);


    let startMonth;
    let endMonth;


    /*
       First Term:
       September - December

       Second Term:
       January - April

       Third Term:
       May - July
    */

    if (term === "First Term") {

        startMonth = 8;
        endMonth = 11;

        return {
            start:
                `${startYear}-09-01`,

            end:
                `${startYear}-12-31`
        };

    }


    if (term === "Second Term") {

        startMonth = 0;
        endMonth = 3;

        return {
            start:
                `${startYear + 1}-01-01`,

            end:
                `${startYear + 1}-04-30`
        };

    }


    if (term === "Third Term") {

        startMonth = 4;
        endMonth = 6;

        return {
            start:
                `${startYear + 1}-05-01`,

            end:
                `${startYear + 1}-07-31`
        };

    }


    return null;

}


/* =========================================================
   LOAD ATTENDANCE RECORDS FOR TERM
========================================================= */

async function loadTermAttendance() {

    const session =
        attendanceSession.value;

    const term =
        attendanceTerm.value;

    const selectedClass =
        attendanceClass.value;


    if (
        !session ||
        !term ||
        !selectedClass
    ) {

        return;

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );


        attendanceRecords = [];


        snapshot.forEach(
            documentSnapshot => {

                const record =
                    documentSnapshot.data();


                if (
                    record.session === session &&
                    record.term === term &&
                    record.class === selectedClass
                ) {

                    attendanceRecords.push({

                        firestoreId:
                            documentSnapshot.id,

                        ...record

                    });

                }

            }
        );


    } catch (error) {

        console.error(
            "Error loading attendance:",
            error
        );

    }

}


/* =========================================================
   CALCULATE STUDENT ATTENDANCE
========================================================= */

function calculateAttendance(
    studentId
) {

    const studentRecords =
        attendanceRecords.filter(
            record =>
                record.studentId ===
                studentId
        );


    let present = 0;
    let absent = 0;
    let late = 0;


    studentRecords.forEach(
        record => {

            if (
                record.status ===
                "Present"
            ) {

                present++;

            }

            else if (
                record.status ===
                "Absent"
            ) {

                absent++;

            }

            else if (
                record.status ===
                "Late"
            ) {

                late++;

            }

        }
    );


    const totalDays =
        present +
        absent +
        late;


    const attended =
        present +
        late;


    const percentage =
        totalDays > 0
            ? (
                attended /
                totalDays
            ) * 100
            : 0;


    return {

        present,
        absent,
        late,
        totalDays,
        percentage:
            percentage.toFixed(1)

    };

}


/* =========================================================
   LOAD ATTENDANCE TABLE
========================================================= */

async function loadAttendance() {

    const session =
        attendanceSession.value;

    const term =
        attendanceTerm.value;

    const selectedClass =
        attendanceClass.value;

    const date =
        attendanceDate.value;


    if (
        !session ||
        !term ||
        !selectedClass ||
        !date
    ) {

        alert(
            "Please select the academic session, term, class and date."
        );

        return;

    }


    const studentsLoaded =
        await loadStudents();


    if (!studentsLoaded) {

        return;

    }


    await loadTermAttendance();


    renderAttendanceTable();


    attendanceTableCard.style.display =
        "block";

    attendanceSummaryCard.style.display =
        "block";


    attendanceDateTitle.textContent =
        `${selectedClass} • ${formatDate(date)}`;


    updateSummary();

}


/* =========================================================
   RENDER ATTENDANCE TABLE
========================================================= */

function renderAttendanceTable() {

    attendanceTableBody.innerHTML =
        "";


    students.forEach(
        (student, index) => {

            const studentName =
                `${student.firstName || ""} ${student.lastName || ""}`
                    .trim();


            const admissionNumber =
                student.id ||
                student.admissionNumber ||
                "-";


            const existingRecord =
                attendanceRecords.find(
                    record =>

                        record.studentId ===
                        (
                            student.firestoreId ||
                            student.id
                        ) &&

                        record.date ===
                        attendanceDate.value

                );


            const status =
                existingRecord
                    ?.status ||
                "Present";


            const row =
                document.createElement("tr");


            row.dataset.studentId =
                student.firestoreId ||
                student.id;


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="student-name">

                        <div class="student-avatar">

                            ${escapeHTML(
                                getInitials(
                                    student.firstName,
                                    student.lastName
                                )
                            )}

                        </div>

                        <strong>

                            ${escapeHTML(
                                studentName
                            )}

                        </strong>

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                        admissionNumber
                    )}

                </td>


                <td>

                    <input
                        type="radio"
                        name="attendance-${escapeHTML(
                            student.firestoreId
                        )}"
                        value="Present"
                        ${
                            status === "Present"
                                ? "checked"
                                : ""
                        }
                    >

                </td>


                <td>

                    <input
                        type="radio"
                        name="attendance-${escapeHTML(
                            student.firestoreId
                        )}"
                        value="Absent"
                        ${
                            status === "Absent"
                                ? "checked"
                                : ""
                        }
                    >

                </td>


                <td>

                    <input
                        type="radio"
                        name="attendance-${escapeHTML(
                            student.firestoreId
                        )}"
                        value="Late"
                        ${
                            status === "Late"
                                ? "checked"
                                : ""
                        }
                    >

                </td>


                <td>

                    <span
                        class="attendance-status"
                        data-status-for="${escapeHTML(
                            student.firestoreId
                        )}"
                    >

                        ${status}

                    </span>

                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );


            row.querySelectorAll(
                'input[type="radio"]'
            ).forEach(
                radio => {

                    radio.addEventListener(
                        "change",
                        () => {

                            updateRowStatus(
                                row
                            );

                            updateSummary();

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   UPDATE ROW STATUS
========================================================= */

function updateRowStatus(row) {

    const selected =
        row.querySelector(
            'input[type="radio"]:checked'
        );


    const statusElement =
        row.querySelector(
            ".attendance-status"
        );


    if (
        selected &&
        statusElement
    ) {

        statusElement.textContent =
            selected.value;

    }

}


/* =========================================================
   MARK ALL PRESENT
========================================================= */

markAllPresentBtn.addEventListener(
    "click",
    () => {

        const radios =
            attendanceTableBody.querySelectorAll(
                'input[value="Present"]'
            );


        radios.forEach(
            radio => {

                radio.checked = true;


                const row =
                    radio.closest("tr");


                updateRowStatus(
                    row
                );

            }
        );


        updateSummary();

    }
);


/* =========================================================
   SAVE ATTENDANCE
========================================================= */

saveAttendanceBtn.addEventListener(
    "click",
    saveAttendance
);


async function saveAttendance() {

    const session =
        attendanceSession.value;

    const term =
        attendanceTerm.value;

    const selectedClass =
        attendanceClass.value;

    const date =
        attendanceDate.value;


    if (
        !session ||
        !term ||
        !selectedClass ||
        !date
    ) {

        alert(
            "Please complete all attendance selections."
        );

        return;

    }


    if (students.length === 0) {

        alert(
            "There are no students to save."
        );

        return;

    }


    saveAttendanceBtn.disabled =
        true;

    saveAttendanceBtn.textContent =
        "Saving...";


    try {

        for (
            const student of students
        ) {

            const studentId =
                student.firestoreId ||
                student.id;


            const row =
                attendanceTableBody.querySelector(
                    `tr[data-student-id="${CSS.escape(
                        studentId
                    )}"]`
                );


            if (!row)
                continue;


            const selected =
                row.querySelector(
                    'input[type="radio"]:checked'
                );


            const status =
                selected
                    ? selected.value
                    : "Present";


            const attendanceId =
                `${session
                    .replace("/", "-")}_${term
                    .replace(/\s/g, "-")}_${studentId}_${date}`;


            await setDoc(

                doc(
                    db,
                    "attendance",
                    attendanceId
                ),

                {

                    id:
                        attendanceId,

                    session,

                    term,

                    class:
                        selectedClass,

                    date,

                    studentId,

                    studentName:
                        `${student.firstName || ""} ${student.lastName || ""}`
                            .trim(),

                    status,

                    updatedAt:
                        new Date().toISOString()

                },

                {
                    merge: true
                }

            );

        }


        alert(
            "Attendance saved successfully."
        );


        await loadTermAttendance();

        updateSummary();


    } catch (error) {

        console.error(
            "Error saving attendance:",
            error
        );


        alert(
            "Unable to save attendance. Check your Firestore rules and Firebase configuration."
        );

    }


    finally {

        saveAttendanceBtn.disabled =
            false;

        saveAttendanceBtn.textContent =
            "Save Attendance";

    }

}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {

    let present = 0;
    let absent = 0;
    let late = 0;


    const rows =
        attendanceTableBody.querySelectorAll(
            "tr"
        );


    rows.forEach(
        row => {

            const selected =
                row.querySelector(
                    'input[type="radio"]:checked'
                );


            if (!selected)
                return;


            if (
                selected.value ===
                "Present"
            ) {

                present++;

            }

            else if (
                selected.value ===
                "Absent"
            ) {

                absent++;

            }

            else if (
                selected.value ===
                "Late"
            ) {

                late++;

            }

        }
    );


    summaryStudents.textContent =
        students.length;


    summaryPresent.textContent =
        present;


    summaryAbsent.textContent =
        absent;


    summaryLate.textContent =
        late;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString)
        return "";


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(
    firstName,
    lastName
) {

    const first =
        firstName
            ? firstName.charAt(0)
            : "";


    const last =
        lastName
            ? lastName.charAt(0)
            : "";


    return (
        first +
        last
    ).toUpperCase();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   AUTOMATIC REFRESH
========================================================= */

attendanceSession.addEventListener(
    "change",
    () => {

        attendanceTableCard.style.display =
            "none";

        attendanceSummaryCard.style.display =
            "none";

    }
);


attendanceTerm.addEventListener(
    "change",
    () => {

        attendanceTableCard.style.display =
            "none";

        attendanceSummaryCard.style.display =
            "none";

    }
);


attendanceClass.addEventListener(
    "change",
    () => {

        attendanceTableCard.style.display =
            "none";

        attendanceSummaryCard.style.display =
            "none";

    }
);


/* =========================================================
   LOAD BUTTON
========================================================= */

loadAttendanceBtn.addEventListener(
    "click",
    loadAttendance
);


/* =========================================================
   INITIALIZE
========================================================= */

loadClasses();