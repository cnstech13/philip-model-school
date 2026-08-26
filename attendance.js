/* =========================
   FIRESTORE IMPORTS
========================= */

import {
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";


/* =========================
   ATTENDANCE DATA
========================= */

let attendanceRecords = [];

let attendanceStudents = [];

let attendanceClasses = [];


/* =========================
   ELEMENTS
========================= */

const attendanceSession =
    document.getElementById(
        "attendanceSession"
    );

const attendanceTerm =
    document.getElementById(
        "attendanceTerm"
    );

const attendanceClass =
    document.getElementById(
        "attendanceClass"
    );

const attendanceDate =
    document.getElementById(
        "attendanceDate"
    );

const loadAttendanceBtn =
    document.getElementById(
        "loadAttendanceBtn"
    );

const attendanceTableCard =
    document.getElementById(
        "attendanceTableCard"
    );

const attendanceTableBody =
    document.getElementById(
        "attendanceTableBody"
    );

const saveAttendanceBtn =
    document.getElementById(
        "saveAttendanceBtn"
    );

const markAllPresentBtn =
    document.getElementById(
        "markAllPresentBtn"
    );

const attendanceSummaryCard =
    document.getElementById(
        "attendanceSummaryCard"
    );


/* =========================
   LOAD DATA FROM FIRESTORE
========================= */

async function refreshAttendanceData() {

    try {

        /* =====================
           LOAD STUDENTS
        ===================== */

        const studentsSnapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        attendanceStudents =
            studentsSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


        /* =====================
           LOAD CLASSES
        ===================== */

        const classesSnapshot =
            await getDocs(
                collection(
                    db,
                    "classes"
                )
            );


        attendanceClasses =
            classesSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


        /* =====================
           LOAD ATTENDANCE
        ===================== */

        const attendanceSnapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );


        attendanceRecords =
            attendanceSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


    }

    catch (error) {

        console.error(
            "Error loading attendance data:",
            error
        );


        alert(
            "Unable to load attendance data from Firestore."
        );

    }

}


/* =========================
   LOAD CLASSES
========================= */

async function loadAttendanceClasses() {

    await refreshAttendanceData();


    attendanceClass.innerHTML = `

        <option value="">
            Select Class
        </option>

    `;


    attendanceClasses

        .filter(
            item =>
                item.status === "Active"
        )

        .forEach(item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.name;


            option.textContent =
                item.name;


            attendanceClass.appendChild(
                option
            );

        });

}


/* =========================
   LOAD STUDENTS
========================= */

loadAttendanceBtn.addEventListener(
    "click",
    loadAttendance
);


async function loadAttendance() {

    await refreshAttendanceData();


    const session =
        attendanceSession.value;


    const term =
        attendanceTerm.value;


    const className =
        attendanceClass.value;


    const date =
        attendanceDate.value;


    if (
        !session ||
        !term ||
        !className ||
        !date
    ) {

        alert(
            "Please select the session, term, class and date."
        );

        return;

    }


    const classStudents =
        attendanceStudents.filter(
            student =>
                student.class ===
                className
        );


    if (
        classStudents.length === 0
    ) {

        alert(
            "There are no students in this class."
        );

        return;

    }


    attendanceTableBody.innerHTML =
        "";


    classStudents.forEach(
        (student, index) => {

            const existing =
                attendanceRecords.find(
                    record =>

                        record.studentId ===
                        student.id &&

                        record.date ===
                        date &&

                        record.session ===
                        session &&

                        record.term ===
                        term

                );


            const status =
                existing
                    ? existing.status
                    : "present";


            const row =
                document.createElement(
                    "tr"
                );


            row.dataset.studentId =
                student.id;


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <strong>

                        ${escapeAttendanceHTML(
                            student.firstName
                        )}

                        ${escapeAttendanceHTML(
                            student.lastName
                        )}

                    </strong>

                </td>


                <td>

                    ${escapeAttendanceHTML(
                        student.id
                    )}

                </td>


                <td>

                    <label class="attendance-status">

                        <label>

                            <input
                                type="radio"
                                name="attendance-${student.id}"
                                value="present"
                                ${
                                    status ===
                                    "present"
                                        ? "checked"
                                        : ""
                                }
                            >

                            <span>
                                P
                            </span>

                        </label>

                    </label>

                </td>


                <td>

                    <label class="attendance-status">

                        <label>

                            <input
                                type="radio"
                                name="attendance-${student.id}"
                                value="absent"
                                ${
                                    status ===
                                    "absent"
                                        ? "checked"
                                        : ""
                                }
                            >

                            <span>
                                A
                            </span>

                        </label>

                    </label>

                </td>


                <td>

                    <label class="attendance-status">

                        <label>

                            <input
                                type="radio"
                                name="attendance-${student.id}"
                                value="late"
                                ${
                                    status ===
                                    "late"
                                        ? "checked"
                                        : ""
                                }
                            >

                            <span>
                                L
                            </span>

                        </label>

                    </label>

                </td>


                <td class="attendance-status-text">

                    ${statusText(status)}

                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );


            setupStatusListener(
                row
            );

        }
    );


    document.getElementById(
        "attendanceDateTitle"
    ).textContent =
        formatDate(date);


    attendanceTableCard.style.display =
        "block";


    attendanceSummaryCard.style.display =
        "block";


    updateAttendanceSummary();

}


/* =========================
   STATUS TEXT
========================= */

function statusText(status) {

    if (
        status === "present"
    )
        return "Present";


    if (
        status === "absent"
    )
        return "Absent";


    return "Late";

}


/* =========================
   STATUS LISTENER
========================= */

function setupStatusListener(row) {

    const radios =
        row.querySelectorAll(
            'input[type="radio"]'
        );


    radios.forEach(
        radio => {

            radio.addEventListener(
                "change",
                function() {

                    row.querySelector(
                        ".attendance-status-text"
                    ).textContent =
                        statusText(
                            this.value
                        );


                    updateAttendanceSummary();

                }
            );

        }
    );

}


/* =========================
   MARK ALL PRESENT
========================= */

markAllPresentBtn.addEventListener(
    "click",
    function() {

        const rows =
            attendanceTableBody.querySelectorAll(
                "tr"
            );


        rows.forEach(
            row => {

                const present =
                    row.querySelector(
                        'input[value="present"]'
                    );


                if (present) {

                    present.checked =
                        true;

                }


                row.querySelector(
                    ".attendance-status-text"
                ).textContent =
                    "Present";

            }
        );


        updateAttendanceSummary();

    }
);


/* =========================
   SAVE ATTENDANCE
========================= */

saveAttendanceBtn.addEventListener(
    "click",
    saveAttendance
);


async function saveAttendance() {

    const session =
        attendanceSession.value;


    const term =
        attendanceTerm.value;


    const className =
        attendanceClass.value;


    const date =
        attendanceDate.value;


    const rows =
        attendanceTableBody.querySelectorAll(
            "tr"
        );


    if (
        rows.length === 0
    ) {

        alert(
            "No students to save."
        );

        return;

    }


    if (
        !session ||
        !term ||
        !className ||
        !date
    ) {

        alert(
            "Please select the session, term, class and date."
        );

        return;

    }


    try {

        for (
            const row of rows
        ) {

            const studentId =
                row.dataset.studentId;


            const selected =
                row.querySelector(
                    'input[type="radio"]:checked'
                );


            const status =
                selected
                    ? selected.value
                    : "present";


            /*
             * Use a predictable document ID.
             *
             * This means the same student's
             * attendance for the same date,
             * session and term can be updated.
             */

            const attendanceId =
                `ATT-${session.replace(
                    /\//g,
                    "-"
                )}-${term}-${date}-${studentId}`;


            const attendanceRef =
                doc(
                    db,
                    "attendance",
                    attendanceId
                );


            const existing =
                attendanceRecords.find(
                    record =>
                        record.id ===
                        attendanceId
                );


            const attendanceData = {

                studentId,

                className,

                session,

                term,

                date,

                status,

                updatedAt:
                    new Date().toISOString()

            };


            if (!existing) {

                attendanceData.createdAt =
                    new Date().toISOString();

            }


            await setDoc(
                attendanceRef,
                attendanceData,
                {
                    merge: true
                }
            );

        }


        /*
         * Refresh local memory
         * from Firestore
         */

        await refreshAttendanceData();


        alert(
            "Attendance saved successfully."
        );


        updateAttendanceSummary();

    }

    catch (error) {

        console.error(
            "Error saving attendance:",
            error
        );


        alert(
            "Unable to save attendance. Please try again."
        );

    }

}


/* =========================
   SUMMARY
========================= */

function updateAttendanceSummary() {

    const rows =
        attendanceTableBody.querySelectorAll(
            "tr"
        );


    let present = 0;

    let absent = 0;

    let late = 0;


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
                "present"
            )
                present++;


            else if (
                selected.value ===
                "absent"
            )
                absent++;


            else
                late++;

        }
    );


    document.getElementById(
        "summaryStudents"
    ).textContent =
        rows.length;


    document.getElementById(
        "summaryPresent"
    ).textContent =
        present;


    document.getElementById(
        "summaryAbsent"
    ).textContent =
        absent;


    document.getElementById(
        "summaryLate"
    ).textContent =
        late;

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(date) {

    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================
   ESCAPE HTML
========================= */

function escapeAttendanceHTML(
    value
) {

    return String(value)

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


/* =========================
   INITIALIZE
========================= */

loadAttendanceClasses();