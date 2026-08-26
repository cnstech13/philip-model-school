/* =========================================================
   PHILIP MODEL SCHOOL
   REPORT CARD SYSTEM
   FULL FIRESTORE VERSION
========================================================= */

import { db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIRESTORE COLLECTIONS
========================================================= */

const STUDENTS_COLLECTION = "students";
const CLASSES_COLLECTION = "classes";
const SUBJECTS_COLLECTION = "subjects";
const RESULTS_COLLECTION = "results";
const ATTENDANCE_COLLECTION = "attendanceRecords";
const REPORTS_COLLECTION = "reportCards";


/* =========================================================
   FIRESTORE DATA
========================================================= */

let reportStudents = [];

let reportClasses = [];

let reportSubjects = [];


/* =========================================================
   PSYCHOMOTOR / CONDUCT TRAITS
========================================================= */

const conductTraits = [
    "Punctuality",
    "Neatness",
    "Attentiveness",
    "Class Participation",
    "Leadership",
    "Teamwork",
    "Responsibility",
    "Creativity",
    "Self Confidence",
    "Self Control",
    "Relationship With Others",
    "Sports"
];


/* =========================================================
   ELEMENTS
========================================================= */

const reportSession =
    document.getElementById(
        "reportSession"
    );

const reportTerm =
    document.getElementById(
        "reportTerm"
    );

const reportClass =
    document.getElementById(
        "reportClass"
    );

const reportStudent =
    document.getElementById(
        "reportStudent"
    );

const generateReportBtn =
    document.getElementById(
        "generateReportBtn"
    );

const reportCard =
    document.getElementById(
        "reportCard"
    );

const printReportBtn =
    document.getElementById(
        "printReportBtn"
    );

const saveReportBtn =
    document.getElementById(
        "saveReportBtn"
    );


/* =========================================================
   LOAD ALL STUDENTS
========================================================= */

async function loadReportStudentsFromFirestore() {

    try {

        const studentsRef =
            collection(
                db,
                STUDENTS_COLLECTION
            );


        const snapshot =
            await getDocs(
                studentsRef
            );


        reportStudents = [];


        snapshot.forEach(
            document => {

                reportStudents.push({

                    id:
                        document.id,

                    ...document.data()

                });

            }
        );


        return reportStudents;


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        alert(
            "Unable to load students from Firebase."
        );


        return [];

    }

}


/* =========================================================
   LOAD ALL CLASSES
========================================================= */

async function loadReportClassesFromFirestore() {

    try {

        const classesRef =
            collection(
                db,
                CLASSES_COLLECTION
            );


        const snapshot =
            await getDocs(
                classesRef
            );


        reportClasses = [];


        snapshot.forEach(
            document => {

                reportClasses.push({

                    id:
                        document.id,

                    ...document.data()

                });

            }
        );


        return reportClasses;


    } catch (error) {

        console.error(
            "Error loading classes:",
            error
        );


        alert(
            "Unable to load classes from Firebase."
        );


        return [];

    }

}


/* =========================================================
   LOAD ALL SUBJECTS
========================================================= */

async function loadReportSubjectsFromFirestore() {

    try {

        const subjectsRef =
            collection(
                db,
                SUBJECTS_COLLECTION
            );


        const snapshot =
            await getDocs(
                subjectsRef
            );


        reportSubjects = [];


        snapshot.forEach(
            document => {

                reportSubjects.push({

                    id:
                        document.id,

                    ...document.data()

                });

            }
        );


        return reportSubjects;


    } catch (error) {

        console.error(
            "Error loading subjects:",
            error
        );


        alert(
            "Unable to load subjects from Firebase."
        );


        return [];

    }

}


/* =========================================================
   LOAD CLASSES INTO SELECT
========================================================= */

async function loadReportClasses() {

    reportClass.innerHTML = `

        <option value="">
            Loading classes...
        </option>

    `;


    await loadReportClassesFromFirestore();


    reportClass.innerHTML = `

        <option value="">
            Select Class
        </option>

    `;


    reportClasses
        .filter(
            item =>
                item.status === "Active"
        )
        .forEach(
            item => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    item.name;


                option.textContent =
                    item.name;


                reportClass.appendChild(
                    option
                );

            }
        );

}


/* =========================================================
   LOAD STUDENTS FOR SELECTED CLASS
========================================================= */

async function loadReportStudents() {

    const selectedClass =
        reportClass.value;


    reportStudent.innerHTML = `

        <option value="">
            Loading students...
        </option>

    `;


    if (!selectedClass) {

        reportStudent.innerHTML = `

            <option value="">
                Select Student
            </option>

        `;

        return;

    }


    try {

        const studentsRef =
            collection(
                db,
                STUDENTS_COLLECTION
            );


        const studentsQuery =
            query(

                studentsRef,

                where(
                    "class",
                    "==",
                    selectedClass
                )

            );


        const snapshot =
            await getDocs(
                studentsQuery
            );


        reportStudents = [];


        reportStudent.innerHTML = `

            <option value="">
                Select Student
            </option>

        `;


        snapshot.forEach(
            document => {

                const student = {

                    id:
                        document.id,

                    ...document.data()

                };


                reportStudents.push(
                    student
                );


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    student.id;


                option.textContent =
                    `${student.firstName || ""} ${student.lastName || ""}`;


                reportStudent.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        reportStudent.innerHTML = `

            <option value="">
                Unable to load students
            </option>

        `;


        alert(
            "Unable to load students from Firebase."
        );

    }

}


/* =========================================================
   CLASS CHANGE
========================================================= */

reportClass.addEventListener(
    "change",
    loadReportStudents
);


/* =========================================================
   LOAD RESULTS FROM FIRESTORE
========================================================= */

async function loadStudentResultsFromFirestore(
    studentId,
    session,
    term
) {

    try {

        const resultsRef =
            collection(
                db,
                RESULTS_COLLECTION
            );


        const resultsQuery =
            query(

                resultsRef,

                where(
                    "studentId",
                    "==",
                    studentId
                ),

                where(
                    "session",
                    "==",
                    session
                ),

                where(
                    "term",
                    "==",
                    term
                )

            );


        const snapshot =
            await getDocs(
                resultsQuery
            );


        const results = [];


        snapshot.forEach(
            document => {

                results.push({

                    id:
                        document.id,

                    ...document.data()

                });

            }
        );


        return results;


    } catch (error) {

        console.error(
            "Error loading Firestore results:",
            error
        );


        alert(
            "Unable to load results from Firebase."
        );


        return [];

    }

}


/* =========================================================
   LOAD ATTENDANCE FROM FIRESTORE
========================================================= */

async function loadAttendanceFromFirestore(
    studentId,
    className,
    session,
    term
) {

    try {

        const attendanceRef =
            collection(
                db,
                ATTENDANCE_COLLECTION
            );


        const attendanceQuery =
            query(

                attendanceRef,

                where(
                    "studentId",
                    "==",
                    studentId
                ),

                where(
                    "className",
                    "==",
                    className
                ),

                where(
                    "session",
                    "==",
                    session
                ),

                where(
                    "term",
                    "==",
                    term
                )

            );


        const snapshot =
            await getDocs(
                attendanceQuery
            );


        const attendanceRecords = [];


        snapshot.forEach(
            document => {

                attendanceRecords.push({

                    id:
                        document.id,

                    ...document.data()

                });

            }
        );


        return attendanceRecords;


    } catch (error) {

        console.error(
            "Error loading attendance:",
            error
        );


        alert(
            "Unable to load attendance from Firebase."
        );


        return [];

    }

}


/* =========================================================
   DISPLAY ATTENDANCE
========================================================= */

async function loadAttendance(
    studentId,
    className,
    session,
    term
) {

    const studentAttendance =
        await loadAttendanceFromFirestore(

            studentId,

            className,

            session,

            term

        );


    const schoolDays =
        studentAttendance.length;


    const daysPresent =
        studentAttendance.filter(
            record =>
                record.status ===
                "present"
        ).length;


    const daysAbsent =
        studentAttendance.filter(
            record =>
                record.status ===
                "absent"
        ).length;


    const schoolDaysElement =
        document.getElementById(
            "schoolDays"
        );


    const daysPresentElement =
        document.getElementById(
            "daysPresent"
        );


    const daysAbsentElement =
        document.getElementById(
            "daysAbsent"
        );


    if (schoolDaysElement) {

        schoolDaysElement.textContent =
            schoolDays;

    }


    if (daysPresentElement) {

        daysPresentElement.textContent =
            daysPresent;

    }


    if (daysAbsentElement) {

        daysAbsentElement.textContent =
            daysAbsent;

    }


    return {

        schoolDays,

        daysPresent,

        daysAbsent

    };

}


/* =========================================================
   REPORT DOCUMENT ID
========================================================= */

function getReportId(
    studentId,
    session,
    term
) {

    const cleanSession =
        String(session)
            .replaceAll(
                "/",
                "-"
            )
            .replaceAll(
                " ",
                "-"
            );


    const cleanTerm =
        String(term)
            .replaceAll(
                " ",
                "-"
            );


    return `${studentId}_${cleanSession}_${cleanTerm}`;

}


/* =========================================================
   LOAD EXISTING REPORT
========================================================= */

async function loadExistingReport(
    studentId,
    session,
    term
) {

    try {

        const reportId =
            getReportId(
                studentId,
                session,
                term
            );


        const reportRef =
            doc(
                db,
                REPORTS_COLLECTION,
                reportId
            );


        const reportSnapshot =
            await getDoc(
                reportRef
            );


        if (
            !reportSnapshot.exists()
        ) {

            return null;

        }


        return reportSnapshot.data();


    } catch (error) {

        console.error(
            "Error loading existing report:",
            error
        );


        return null;

    }

}


/* =========================================================
   GENERATE REPORT
========================================================= */

generateReportBtn.addEventListener(
    "click",
    generateReport
);


async function generateReport() {

    const session =
        reportSession.value;

    const term =
        reportTerm.value;

    const className =
        reportClass.value;

    const studentId =
        reportStudent.value;


    if (
        !session ||
        !term ||
        !className ||
        !studentId
    ) {

        alert(
            "Please select the session, term, class and student."
        );

        return;

    }


    const student =
        reportStudents.find(
            item =>
                item.id ===
                studentId
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;

    }


    if (generateReportBtn) {

        generateReportBtn.disabled =
            true;

        generateReportBtn.textContent =
            "Generating...";

    }


    try {

        /* =================================================
           LOAD RESULTS
        ================================================= */

        const studentResults =
            await loadStudentResultsFromFirestore(

                studentId,

                session,

                term

            );


        if (
            studentResults.length === 0
        ) {

            alert(
                "No results have been entered for this student."
            );

            return;

        }


        /* =================================================
           LOAD SUBJECTS
        ================================================= */

        if (
            reportSubjects.length === 0
        ) {

            await loadReportSubjectsFromFirestore();

        }


        /* =================================================
           STUDENT INFORMATION
        ================================================= */

        document.getElementById(
            "reportStudentName"
        ).textContent =
            `${student.firstName || ""} ${student.lastName || ""}`;


        document.getElementById(
            "reportAdmissionNo"
        ).textContent =
            student.admissionNo ||
            student.id;


        document.getElementById(
            "reportClassName"
        ).textContent =
            className;


        document.getElementById(
            "reportSessionName"
        ).textContent =
            session;


        document.getElementById(
            "reportTermTitle"
        ).textContent =
            `${term} • ${session}`;


        /* =================================================
           RESULT TABLE
        ================================================= */

        const body =
            document.getElementById(
                "reportResultsBody"
            );


        body.innerHTML =
            "";


        let totalScore = 0;


        studentResults.forEach(
            (result, index) => {

                const subject =
                    reportSubjects.find(
                        item =>
                            item.id ===
                            result.subjectId
                    );


                const subjectName =
                    subject
                        ? subject.name
                        : (
                            result.subjectName ||
                            "Unknown Subject"
                        );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeReportHTML(
                            subjectName
                        )}
                    </td>

                    <td>
                        ${result.classWork1 ?? 0}
                    </td>

                    <td>
                        ${result.classWork2 ?? 0}
                    </td>

                    <td>
                        ${result.assignment1 ?? 0}
                    </td>

                    <td>
                        ${result.assignment2 ?? 0}
                    </td>

                    <td>
                        ${result.ca1 ?? 0}
                    </td>

                    <td>
                        ${result.ca2 ?? 0}
                    </td>

                    <td>
                        ${result.exam ?? 0}
                    </td>

                    <td>
                        <strong>
                            ${result.total ?? 0}
                        </strong>
                    </td>

                    <td>
                        <strong>
                            ${escapeReportHTML(
                                result.grade || "-"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeReportHTML(
                            result.remark || "-"
                        )}
                    </td>

                `;


                body.appendChild(
                    row
                );


                totalScore +=
                    Number(
                        result.total ||
                        0
                    );

            }
        );


        /* =================================================
           SUMMARY
        ================================================= */

        const subjectCount =
            studentResults.length;


        const average =
            subjectCount > 0

                ? (
                    totalScore /
                    subjectCount
                ).toFixed(2)

                : "0.00";


        document.getElementById(
            "subjectsOffered"
        ).textContent =
            subjectCount;


        document.getElementById(
            "totalScore"
        ).textContent =
            totalScore;


        document.getElementById(
            "averageScore"
        ).textContent =
            `${average}%`;


        /* =================================================
           POSITION
        ================================================= */

        const position =
            await calculatePosition(

                studentId,

                className,

                session,

                term

            );


        document.getElementById(
            "studentPosition"
        ).textContent =
            position;


        /* =================================================
           PSYCHOMOTOR
        ================================================= */

        createConductTable();


        /* =================================================
           ATTENDANCE
        ================================================= */

        await loadAttendance(

            studentId,

            className,

            session,

            term

        );


        /* =================================================
           EXISTING REPORT
        ================================================= */

        const existingReport =
            await loadExistingReport(

                studentId,

                session,

                term

            );


        if (existingReport) {

            loadExistingReportData(
                existingReport
            );

        }


        /* =================================================
           SHOW REPORT
        ================================================= */

        reportCard.style.display =
            "block";


        reportCard.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });


    } catch (error) {

        console.error(
            "Error generating report:",
            error
        );


        alert(
            "Unable to generate report card."
        );

    } finally {

        if (generateReportBtn) {

            generateReportBtn.disabled =
                false;

            generateReportBtn.textContent =
                "Generate Report";

        }

    }

}


/* =========================================================
   CREATE CONDUCT TABLE
========================================================= */

function createConductTable() {

    const conductBody =
        document.getElementById(
            "conductBody"
        );


    if (!conductBody)
        return;


    conductBody.innerHTML =
        "";


    conductTraits.forEach(
        trait => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeReportHTML(
                        trait
                    )}
                </td>

                <td>

                    <select
                        class="conduct-rating"
                    >

                        <option value="Excellent">
                            Excellent
                        </option>

                        <option value="Very Good">
                            Very Good
                        </option>

                        <option value="Good">
                            Good
                        </option>

                        <option value="Fair">
                            Fair
                        </option>

                        <option value="Poor">
                            Poor
                        </option>

                    </select>

                </td>

            `;


            conductBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   LOAD EXISTING REPORT DATA
========================================================= */

function loadExistingReportData(
    report
) {

    /* =====================================================
       COMMENTS
    ===================================================== */

    const teacherComment =
        document.getElementById(
            "teacherComment"
        );


    if (teacherComment) {

        teacherComment.value =
            report.teacherComment ||
            "";

    }


    const principalComment =
        document.getElementById(
            "principalComment"
        );


    if (principalComment) {

        principalComment.value =
            report.principalComment ||
            "";

    }


    /* =====================================================
       PROMOTION
    ===================================================== */

    const promotionStatus =
        document.getElementById(
            "promotionStatus"
        );


    if (
        promotionStatus &&
        report.promotionStatus
    ) {

        promotionStatus.value =
            report.promotionStatus;

    }


    /* =====================================================
       PSYCHOMOTOR
    ===================================================== */

    if (
        report.psychomotor
    ) {

        document
            .querySelectorAll(
                ".conduct-table tbody tr"
            )
            .forEach(
                row => {

                    const trait =
                        row
                            .querySelector(
                                "td"
                            )
                            .textContent
                            .trim();


                    const savedRating =
                        report
                            .psychomotor[
                                trait
                            ];


                    if (
                        savedRating
                    ) {

                        const select =
                            row.querySelector(
                                ".conduct-rating"
                            );


                        if (select) {

                            select.value =
                                savedRating;

                        }

                    }

                }
            );

    }


    /* =====================================================
       ATTENDANCE
    ===================================================== */

    if (
        report.attendance
    ) {

        const attendance =
            report.attendance;


        const schoolDays =
            document.getElementById(
                "schoolDays"
            );


        const daysPresent =
            document.getElementById(
                "daysPresent"
            );


        const daysAbsent =
            document.getElementById(
                "daysAbsent"
            );


        if (schoolDays) {

            schoolDays.textContent =
                attendance.schoolDays ??
                0;

        }


        if (daysPresent) {

            daysPresent.textContent =
                attendance.daysPresent ??
                0;

        }


        if (daysAbsent) {

            daysAbsent.textContent =
                attendance.daysAbsent ??
                0;

        }

    }

}


/* =========================================================
   CALCULATE POSITION
========================================================= */

async function calculatePosition(
    studentId,
    className,
    session,
    term
) {

    try {

        const resultsRef =
            collection(
                db,
                RESULTS_COLLECTION
            );


        const resultsQuery =
            query(

                resultsRef,

                where(
                    "className",
                    "==",
                    className
                ),

                where(
                    "session",
                    "==",
                    session
                ),

                where(
                    "term",
                    "==",
                    term
                )

            );


        const snapshot =
            await getDocs(
                resultsQuery
            );


        const studentTotals =
            {};


        snapshot.forEach(
            document => {

                const result =
                    document.data();


                if (
                    !result.studentId
                )
                    return;


                if (
                    !studentTotals[
                        result.studentId
                    ]
                ) {

                    studentTotals[
                        result.studentId
                    ] = {

                        total: 0,

                        subjects: 0

                    };

                }


                studentTotals[
                    result.studentId
                ].total +=
                    Number(
                        result.total ||
                        0
                    );


                studentTotals[
                    result.studentId
                ].subjects++;

            }
        );


        const ranking =
            Object.entries(
                studentTotals
            )

            .map(
                ([id, data]) => ({

                    studentId:
                        id,

                    average:
                        data.subjects > 0

                            ? data.total /
                              data.subjects

                            : 0

                })
            )

            .sort(
                (a, b) =>
                    b.average -
                    a.average
            );


        const studentIndex =
            ranking.findIndex(
                item =>
                    item.studentId ===
                    studentId
            );


        if (
            studentIndex === -1
        ) {

            return "-";

        }


        return ordinal(
            studentIndex + 1
        );


    } catch (error) {

        console.error(
            "Error calculating position:",
            error
        );


        return "-";

    }

}


/* =========================================================
   ORDINAL
========================================================= */

function ordinal(
    number
) {

    const mod100 =
        number % 100;


    if (
        mod100 >= 11 &&
        mod100 <= 13
    ) {

        return `${number}th`;

    }


    switch (
        number % 10
    ) {

        case 1:
            return `${number}st`;

        case 2:
            return `${number}nd`;

        case 3:
            return `${number}rd`;

        default:
            return `${number}th`;

    }

}


/* =========================================================
   SAVE REPORT CARD
========================================================= */

async function saveReportCard() {

    const studentId =
        reportStudent.value;

    const session =
        reportSession.value;

    const term =
        reportTerm.value;

    const className =
        reportClass.value;


    if (
        !studentId ||
        !session ||
        !term ||
        !className
    ) {

        alert(
            "Please select the student, class, session and term."
        );

        return;

    }


    /* =====================================================
       FIND STUDENT
    ===================================================== */

    const student =
        reportStudents.find(
            item =>
                item.id ===
                studentId
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;

    }


    /* =====================================================
       PSYCHOMOTOR
    ===================================================== */

    const psychomotor =
        {};


    document
        .querySelectorAll(
            ".conduct-table tbody tr"
        )
        .forEach(
            row => {

                const trait =
                    row
                        .querySelector(
                            "td"
                        )
                        .textContent
                        .trim();


                const select =
                    row.querySelector(
                        ".conduct-rating"
                    );


                if (select) {

                    psychomotor[
                        trait
                    ] =
                        select.value;

                }

            }
        );


    /* =====================================================
       ATTENDANCE
    ===================================================== */

    const schoolDays =
        Number(
            document.getElementById(
                "schoolDays"
            )?.textContent
        ) || 0;


    const daysPresent =
        Number(
            document.getElementById(
                "daysPresent"
            )?.textContent
        ) || 0;


    const daysAbsent =
        Number(
            document.getElementById(
                "daysAbsent"
            )?.textContent
        ) || 0;


    /* =====================================================
       COMMENTS
    ===================================================== */

    const teacherComment =
        document.getElementById(
            "teacherComment"
        )?.value.trim() || "";


    const principalComment =
        document.getElementById(
            "principalComment"
        )?.value.trim() || "";


    /* =====================================================
       PROMOTION
    ===================================================== */

    const promotionStatus =
        document.getElementById(
            "promotionStatus"
        )?.value ||
        "Promoted";


    /* =====================================================
       REPORT ID
    ===================================================== */

    const reportId =
        getReportId(

            studentId,

            session,

            term

        );


    /* =====================================================
       SAVE
    ===================================================== */

    try {

        if (saveReportBtn) {

            saveReportBtn.disabled =
                true;

            saveReportBtn.textContent =
                "Saving...";

        }


        const reportData = {

            studentId,

            studentName:
                `${student.firstName || ""} ${student.lastName || ""}`,

            admissionNo:
                student.admissionNo ||
                student.id,

            className,

            session,

            term,

            attendance: {

                schoolDays,

                daysPresent,

                daysAbsent

            },

            psychomotor,

            teacherComment,

            principalComment,

            promotionStatus,

            updatedAt:
                new Date()

        };


        await setDoc(

            doc(
                db,
                REPORTS_COLLECTION,
                reportId
            ),

            reportData,

            {
                merge: true
            }

        );


        alert(
            "Report card saved successfully."
        );


    } catch (error) {

        console.error(
            "Error saving report card:",
            error
        );


        alert(
            "Unable to save report card. Check your Firebase configuration and Firestore rules."
        );


    } finally {

        if (saveReportBtn) {

            saveReportBtn.disabled =
                false;

            saveReportBtn.textContent =
                "💾 Save Report";

        }

    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeReportHTML(
    value
) {

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
   PRINT REPORT
========================================================= */

if (printReportBtn) {

    printReportBtn.addEventListener(
        "click",
        function() {

            window.print();

        }
    );

}


/* =========================================================
   SAVE BUTTON
========================================================= */

if (saveReportBtn) {

    saveReportBtn.addEventListener(
        "click",
        saveReportCard
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeReportCard() {

    try {

        await Promise.all([

            loadReportClassesFromFirestore(),

            loadReportSubjectsFromFirestore()

        ]);


        await loadReportClasses();


    } catch (error) {

        console.error(
            "Error initializing report card:",
            error
        );

    }

}


initializeReportCard();