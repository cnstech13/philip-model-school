/* =========================================================
   PHILIP MODEL SCHOOL
   PARENT / STUDENT PORTAL
   FULL FIRESTORE VERSION
========================================================= */

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const userName =
    document.getElementById("userName");

const welcomeName =
    document.getElementById("welcomeName");

const studentName =
    document.getElementById("studentName");

const studentClass =
    document.getElementById("studentClass");

const admissionNo =
    document.getElementById("admissionNo");

const average =
    document.getElementById("average");

const position =
    document.getElementById("position");

const attendance =
    document.getElementById("attendance");

const subjectCount =
    document.getElementById("subjectCount");

const recentResults =
    document.getElementById("recentResults");

const resultsTable =
    document.getElementById("resultsTable");

const childSelectorContainer =
    document.getElementById(
        "childSelectorContainer"
    );

const childSelector =
    document.getElementById(
        "childSelector"
    );


/* =========================================================
   RESULTS FILTERS
========================================================= */

const sessionFilter =
    document.getElementById(
        "sessionFilter"
    );

const termFilter =
    document.getElementById(
        "termFilter"
    );


/* =========================================================
   REPORT CARD ELEMENTS
========================================================= */

const reportStudentName =
    document.getElementById(
        "reportStudentName"
    );

const reportStudentClass =
    document.getElementById(
        "reportStudentClass"
    );

const reportSession =
    document.getElementById(
        "reportSession"
    );

const reportTerm =
    document.getElementById(
        "reportTerm"
    );

const reportResultsTable =
    document.getElementById(
        "reportResultsTable"
    );

const reportSessionFilter =
    document.getElementById(
        "reportSessionFilter"
    );

const reportTermFilter =
    document.getElementById(
        "reportTermFilter"
    );

const loadReportCardBtn =
    document.getElementById(
        "loadReportCardBtn"
    );

const downloadReportBtn =
    document.getElementById(
        "downloadReportBtn"
    );


/* =========================================================
   REPORT CARD PSYCHOMOTOR
========================================================= */

const psychomotorFields = {

    punctuality:
        document.getElementById("punctuality"),

    neatness:
        document.getElementById("neatness"),

    attentiveness:
        document.getElementById("attentiveness"),

    classParticipation:
        document.getElementById("classParticipation"),

    leadership:
        document.getElementById("leadership"),

    teamwork:
        document.getElementById("teamwork"),

    responsibility:
        document.getElementById("responsibility"),

    creativity:
        document.getElementById("creativity"),

    selfConfidence:
        document.getElementById("selfConfidence"),

    selfControl:
        document.getElementById("selfControl"),

    relationshipWithOthers:
        document.getElementById("relationshipWithOthers"),

    sports:
        document.getElementById("sports")

};


/* =========================================================
   REPORT CARD COMMENTS
========================================================= */

const teacherComment =
    document.getElementById(
        "teacherComment"
    );

const principalComment =
    document.getElementById(
        "principalComment"
    );


/* =========================================================
   REPORT CARD ATTENDANCE
========================================================= */

const reportPresent =
    document.getElementById(
        "reportPresent"
    );

const reportAbsent =
    document.getElementById(
        "reportAbsent"
    );

const reportLate =
    document.getElementById(
        "reportLate"
    );

const reportAttendanceRate =
    document.getElementById(
        "reportAttendanceRate"
    );


/* =========================================================
   PERFORMANCE ELEMENTS
========================================================= */

const performanceAverage =
    document.getElementById(
        "performanceAverage"
    );

const bestSubject =
    document.getElementById(
        "bestSubject"
    );

const lowestSubject =
    document.getElementById(
        "lowestSubject"
    );


/* =========================================================
   ATTENDANCE ELEMENTS
========================================================= */

const attendanceRate =
    document.getElementById(
        "attendanceRate"
    );

const presentDays =
    document.getElementById(
        "presentDays"
    );

const absentDays =
    document.getElementById(
        "absentDays"
    );


/* =========================================================
   CURRENT DATA
========================================================= */

let currentUser = null;

let currentStudent = null;

let children = [];


/* =========================================================
   AUTHENTICATION
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "parent-login.html";

            return;

        }


        currentUser = user;


        if (userName) {

            userName.textContent =
                user.email || "User";

        }


        if (welcomeName) {

            welcomeName.textContent =
                user.email
                    ? user.email.split("@")[0]
                    : "Student";

        }


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );


        if (profileEmail) {

            profileEmail.textContent =
                user.email || "-";

        }


        await loadUserData();

    }
);


/* =========================================================
   LOAD USER DATA
========================================================= */

async function loadUserData() {

    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        /*
         * FIRST:
         * Find children linked to parent.
         */

        const parentQuery =
            query(
                studentsRef,

                where(
                    "parentId",
                    "==",
                    currentUser.uid
                )
            );


        const parentSnapshot =
            await getDocs(
                parentQuery
            );


        if (!parentSnapshot.empty) {

            children = [];

            parentSnapshot.forEach(
                document => {

                    children.push({

                        id:
                            document.id,

                        ...document.data()

                    });

                }
            );


            setupChildren();

            return;

        }


        /*
         * SECOND:
         * Check whether the logged-in
         * account belongs directly
         * to a student.
         */

        const studentQuery =
            query(
                studentsRef,

                where(
                    "userId",
                    "==",
                    currentUser.uid
                )
            );


        const studentSnapshot =
            await getDocs(
                studentQuery
            );


        if (!studentSnapshot.empty) {

            children = [];

            studentSnapshot.forEach(
                document => {

                    children.push({

                        id:
                            document.id,

                        ...document.data()

                    });

                }
            );


            setupChildren();

            return;

        }


        showNoStudent();


    } catch (error) {

        console.error(
            "Error loading user data:",
            error
        );


        showNoStudent();

    }

}


/* =========================================================
   SETUP CHILDREN
========================================================= */

function setupChildren() {

    if (
        children.length > 1
    ) {

        childSelectorContainer.style.display =
            "block";


        childSelector.innerHTML = `

            <option value="">
                Select Child
            </option>

        `;


        children.forEach(
            child => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    child.id;


                option.textContent =
                    getStudentName(
                        child
                    );


                childSelector.appendChild(
                    option
                );

            }
        );

    }


    if (
        children.length > 0
    ) {

        currentStudent =
            children[0];


        if (
            childSelector
        ) {

            childSelector.value =
                currentStudent.id;

        }


        displayStudent(
            currentStudent
        );

    }

}


/* =========================================================
   CHILD SELECTOR
========================================================= */

if (childSelector) {

    childSelector.addEventListener(
        "change",
        async () => {

            const selected =
                children.find(
                    child =>
                        child.id ===
                        childSelector.value
                );


            if (!selected)
                return;


            currentStudent =
                selected;


            await displayStudent(
                currentStudent
            );


            await loadReportCard();

        }
    );

}


/* =========================================================
   GET STUDENT NAME
========================================================= */

function getStudentName(
    student
) {

    if (
        student.name
    ) {

        return student.name;

    }


    return [

        student.firstName || "",

        student.lastName || ""

    ]

        .join(" ")

        .trim() || "-";

}


/* =========================================================
   GET CLASS NAME
========================================================= */

function getClassName(
    student
) {

    return (

        student.className ||

        student.class ||

        "-"

    );

}


/* =========================================================
   GET ADMISSION NUMBER
========================================================= */

function getAdmissionNumber(
    student
) {

    return (

        student.admissionNo ||

        student.admissionNumber ||

        student.id ||

        "-"

    );

}


/* =========================================================
   DISPLAY STUDENT
========================================================= */

async function displayStudent(
    student
) {

    const name =
        getStudentName(
            student
        );

    const className =
        getClassName(
            student
        );

    const admission =
        getAdmissionNumber(
            student
        );


    studentName.textContent =
        name;


    studentClass.textContent =
        className;


    admissionNo.textContent =
        admission;


    document.getElementById(
        "profileName"
    ).textContent =
        name;


    document.getElementById(
        "profileRole"
    ).textContent =
        "Student";


    /*
     * Reset dashboard statistics
     * before loading Firestore data.
     */

    average.textContent =
        "-";

    position.textContent =
        "-";

    attendance.textContent =
        "-";

    subjectCount.textContent =
        "-";


    await loadDashboardData(
        student.id
    );


    await loadResults(
        student.id
    );

}


/* =========================================================
   LOAD DASHBOARD DATA
========================================================= */

async function loadDashboardData(
    studentId
) {

    try {

        const session =
            sessionFilter
                ? sessionFilter.value
                : "2026/2027";


        const term =
            termFilter
                ? termFilter.value
                : "First Term";


        const results =
            await getStudentResults(
                studentId,
                session,
                term
            );


        const subjectTotal =
            results.length;


        let total =
            0;


        results.forEach(
            result => {

                total +=
                    Number(
                        result.total || 0
                    );

            }
        );


        const avg =
            subjectTotal > 0
                ? total / subjectTotal
                : 0;


        average.textContent =
            subjectTotal > 0
                ? `${avg.toFixed(2)}%`
                : "-";


        subjectCount.textContent =
            subjectTotal || "-";


        /*
         * Calculate position
         */

        if (subjectTotal > 0) {

            const studentPosition =
                await calculatePosition(
                    studentId,
                    getClassName(
                        currentStudent
                    ),
                    session,
                    term
                );


            position.textContent =
                studentPosition;

        }


        /*
         * Attendance
         */

        await loadDashboardAttendance(
            studentId,
            session,
            term
        );


    } catch (error) {

        console.error(
            "Dashboard data error:",
            error
        );

    }

}


/* =========================================================
   GET STUDENT RESULTS
========================================================= */

async function getStudentResults(
    studentId,
    session,
    term
) {

    const resultsRef =
        collection(
            db,
            "results"
        );


    const resultQuery =
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
            resultQuery
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

}


/* =========================================================
   LOAD RESULTS
========================================================= */

async function loadResults(
    studentId
) {

    try {

        recentResults.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading"
                >
                    Loading results...
                </td>

            </tr>

        `;


        resultsTable.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    class="loading"
                >
                    Loading results...
                </td>

            </tr>

        `;


        const session =
            sessionFilter.value;


        const term =
            termFilter.value;


        const results =
            await getStudentResults(
                studentId,
                session,
                term
            );


        recentResults.innerHTML =
            "";


        resultsTable.innerHTML =
            "";


        if (
            results.length === 0
        ) {

            recentResults.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="loading"
                    >
                        No results available
                        for ${safe(session)}
                        -
                        ${safe(term)}.
                    </td>

                </tr>

            `;


            resultsTable.innerHTML = `

                <tr>

                    <td
                        colspan="11"
                        class="loading"
                    >
                        No results available
                        for ${safe(session)}
                        -
                        ${safe(term)}.
                    </td>

                </tr>

            `;


            updatePerformance([]);

            return;

        }


        /*
         * Sort results alphabetically
         */

        results.sort(
            (a, b) =>
                String(
                    a.subject || ""
                ).localeCompare(
                    String(
                        b.subject || ""
                    )
                )
        );


        results.forEach(
            result => {

                /*
                 * DASHBOARD
                 */

                const recentRow =
                    document.createElement(
                        "tr"
                    );


                recentRow.innerHTML = `

                    <td>
                        ${safe(
                            result.subject ||
                            result.subjectName
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.ca1
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.ca2
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.exam
                        )}
                    </td>

                    <td>
                        <strong>
                            ${valueOrDash(
                                result.total
                            )}
                        </strong>
                    </td>

                    <td>
                        ${safe(
                            result.grade
                        )}
                    </td>

                `;


                recentResults.appendChild(
                    recentRow
                );


                /*
                 * COMPLETE RESULTS
                 */

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${safe(
                            result.subject ||
                            result.subjectName
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.classWork1
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.classWork2
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.assignment1
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.assignment2
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.ca1
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.ca2
                        )}
                    </td>

                    <td>
                        ${valueOrDash(
                            result.exam
                        )}
                    </td>

                    <td>
                        <strong>
                            ${valueOrDash(
                                result.total
                            )}
                        </strong>
                    </td>

                    <td>
                        ${safe(
                            result.grade
                        )}
                    </td>

                    <td>
                        ${safe(
                            result.remark
                        )}
                    </td>

                `;


                resultsTable.appendChild(
                    row
                );

            }
        );


        updatePerformance(
            results
        );


    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );


        recentResults.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading"
                >
                    Unable to load results.
                </td>

            </tr>

        `;

    }

}


/* =========================================================
   RESULT FILTER CHANGE
========================================================= */

if (sessionFilter) {

    sessionFilter.addEventListener(
        "change",
        async () => {

            if (!currentStudent)
                return;


            await loadResults(
                currentStudent.id
            );


            await loadDashboardData(
                currentStudent.id
            );

        }
    );

}


if (termFilter) {

    termFilter.addEventListener(
        "change",
        async () => {

            if (!currentStudent)
                return;


            await loadResults(
                currentStudent.id
            );


            await loadDashboardData(
                currentStudent.id
            );

        }
    );

}


/* =========================================================
   PERFORMANCE
========================================================= */

function updatePerformance(
    results
) {

    if (
        results.length === 0
    ) {

        performanceAverage.textContent =
            "-";

        bestSubject.textContent =
            "-";

        lowestSubject.textContent =
            "-";

        return;

    }


    let total = 0;


    results.forEach(
        result => {

            total +=
                Number(
                    result.total || 0
                );

        }
    );


    const avg =
        total /
        results.length;


    performanceAverage.textContent =
        `${avg.toFixed(2)}%`;


    const sorted =
        [...results].sort(
            (a, b) =>
                Number(
                    b.total || 0
                ) -
                Number(
                    a.total || 0
                )
        );


    const best =
        sorted[0];


    const lowest =
        sorted[
            sorted.length - 1
        ];


    bestSubject.textContent =
        best
            ? `${best.subject || best.subjectName || "-"} (${best.total ?? 0})`
            : "-";


    lowestSubject.textContent =
        lowest
            ? `${lowest.subject || lowest.subjectName || "-"} (${lowest.total ?? 0})`
            : "-";

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
                "results"
            );


        const resultQuery =
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
                resultQuery
            );


        const totals = {};


        snapshot.forEach(
            document => {

                const result =
                    document.data();


                if (
                    !result.studentId
                )
                    return;


                if (
                    !totals[
                        result.studentId
                    ]
                ) {

                    totals[
                        result.studentId
                    ] = {

                        total: 0,

                        subjects: 0

                    };

                }


                totals[
                    result.studentId
                ].total +=
                    Number(
                        result.total || 0
                    );


                totals[
                    result.studentId
                ].subjects++;

            }
        );


        const ranking =
            Object.entries(
                totals
            )

                .map(
                    ([id, data]) => ({

                        studentId:
                            id,

                        average:
                            data.subjects
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


        const index =
            ranking.findIndex(
                item =>
                    item.studentId ===
                    studentId
            );


        if (
            index === -1
        ) {

            return "-";

        }


        return ordinal(
            index + 1
        );


    } catch (error) {

        console.error(
            "Position calculation error:",
            error
        );


        return "-";

    }

}


/* =========================================================
   DASHBOARD ATTENDANCE
========================================================= */

async function loadDashboardAttendance(
    studentId,
    session,
    term
) {

    try {

        const attendanceRef =
            collection(
                db,
                "attendanceRecords"
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


        let present = 0;

        let absent = 0;

        let late = 0;


        snapshot.forEach(
            document => {

                const record =
                    document.data();


                if (
                    record.status ===
                    "present"
                )
                    present++;


                else if (
                    record.status ===
                    "absent"
                )
                    absent++;


                else if (
                    record.status ===
                    "late"
                )
                    late++;

            }
        );


        const total =
            present +
            absent +
            late;


        const rate =
            total > 0
                ? (
                    present /
                    total *
                    100
                ).toFixed(2)
                : 0;


        attendance.textContent =
            total > 0
                ? `${rate}%`
                : "-";


        attendanceRate.textContent =
            total > 0
                ? `${rate}%`
                : "-";


        presentDays.textContent =
            present;


        absentDays.textContent =
            absent;


    } catch (error) {

        console.error(
            "Attendance error:",
            error
        );


        attendance.textContent =
            "-";

    }

}


/* =========================================================
   REPORT CARD
========================================================= */

if (loadReportCardBtn) {

    loadReportCardBtn.addEventListener(
        "click",
        loadReportCard
    );

}


async function loadReportCard() {

    if (!currentStudent) {

        reportResultsTable.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    class="loading"
                >
                    No student selected.
                </td>

            </tr>

        `;

        return;

    }


    const session =
        reportSessionFilter.value;


    const term =
        reportTermFilter.value;


    reportResultsTable.innerHTML = `

        <tr>

            <td
                colspan="11"
                class="loading"
            >
                Loading report card...
            </td>

        </tr>

    `;


    try {

        const student =
            currentStudent;


        reportStudentName.textContent =
            getStudentName(
                student
            );


        reportStudentClass.textContent =
            getClassName(
                student
            );


        reportSession.textContent =
            session;


        reportTerm.textContent =
            term;


        /*
         * LOAD RESULTS
         */

        const results =
            await getStudentResults(
                student.id,
                session,
                term
            );


        reportResultsTable.innerHTML =
            "";


        if (
            results.length === 0
        ) {

            reportResultsTable.innerHTML = `

                <tr>

                    <td
                        colspan="11"
                        class="loading"
                    >
                        No results found for
                        ${safe(session)}
                        -
                        ${safe(term)}.
                    </td>

                </tr>

            `;

        } else {

            results.sort(
                (a, b) =>
                    String(
                        a.subject || ""
                    ).localeCompare(
                        String(
                            b.subject || ""
                        )
                    )
            );


            results.forEach(
                result => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${safe(
                                result.subject ||
                                result.subjectName
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.classWork1
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.classWork2
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.assignment1
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.assignment2
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.ca1
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.ca2
                            )}
                        </td>

                        <td>
                            ${valueOrDash(
                                result.exam
                            )}
                        </td>

                        <td>
                            <strong>
                                ${valueOrDash(
                                    result.total
                                )}
                            </strong>
                        </td>

                        <td>
                            ${safe(
                                result.grade
                            )}
                        </td>

                        <td>
                            ${safe(
                                result.remark
                            )}
                        </td>

                    `;


                    reportResultsTable
                        .appendChild(
                            row
                        );

                }
            );

        }


        /*
         * LOAD SAVED REPORT
         */

        await loadReportDetails(
            student.id,
            session,
            term
        );


        /*
         * LOAD ATTENDANCE
         */

        await loadReportAttendance(
            student.id,
            session,
            term
        );


    } catch (error) {

        console.error(
            "Report card error:",
            error
        );


        reportResultsTable.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    class="loading"
                >
                    Unable to load report card.
                </td>

            </tr>

        `;

    }

}


/* =========================================================
   LOAD REPORT DETAILS
========================================================= */

async function loadReportDetails(
    studentId,
    session,
    term
) {

    try {

        const reportRef =
            collection(
                db,
                "reportCards"
            );


        const reportQuery =
            query(

                reportRef,

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
                reportQuery
            );


        if (
            snapshot.empty
        ) {

            clearReportDetails();

            return;

        }


        const report =
            snapshot.docs[0].data();


        /*
         * PSYCHOMOTOR
         */

        const psychomotor =
            report.psychomotor ||
            {};


        /*
         * Because the report-card
         * system stores the official
         * trait names, map them to
         * the portal IDs.
         */

        setPsychomotor(
            "punctuality",
            psychomotor[
                "Punctuality"
            ]
        );


        setPsychomotor(
            "neatness",
            psychomotor[
                "Neatness"
            ]
        );


        setPsychomotor(
            "attentiveness",
            psychomotor[
                "Attentiveness"
            ]
        );


        setPsychomotor(
            "leadership",
            psychomotor[
                "Leadership"
            ]
        );


        setPsychomotor(
            "teamwork",
            psychomotor[
                "Teamwork"
            ]
        );


        setPsychomotor(
            "creativity",
            psychomotor[
                "Creativity"
            ]
        );


        setPsychomotor(
            "selfConfidence",
            psychomotor[
                "Self-Confidence"
            ]
        );


        /*
         * Portal calls this
         * "Obedience".
         *
         * The report-card system
         * uses "Responsibility".
         *
         * Use Responsibility here.
         */

        setPsychomotor(
            "obedience",
            psychomotor[
                "Responsibility"
            ]
        );


        /*
         * Portal calls this
         * "Relationship With Others".
         *
         * Report card uses
         * "Respect for Others".
         */

        setPsychomotor(
            "relationshipWithOthers",
            psychomotor[
                "Respect for Others"
            ]
        );


        setPsychomotor(
            "sports",
            psychomotor[
                "Sports"
            ]
        );


        /*
         * COMMENTS
         */

        teacherComment.textContent =
            report.teacherComment ||
            "No teacher's comment available.";


        principalComment.textContent =
            report.principalComment ||
            "No principal's comment available.";


    } catch (error) {

        console.error(
            "Report details error:",
            error
        );


        clearReportDetails();

    }

}


/* =========================================================
   SET PSYCHOMOTOR
========================================================= */

function setPsychomotor(
    field,
    value
) {

    if (
        psychomotorFields[field]
    ) {

        psychomotorFields[field]
            .textContent =
            value || "-";

    }

}


/* =========================================================
   CLEAR REPORT DETAILS
========================================================= */

function clearReportDetails() {

    Object.values(
        psychomotorFields
    ).forEach(
        element => {

            if (element) {

                element.textContent =
                    "-";

            }

        }
    );


    if (teacherComment) {

        teacherComment.textContent =
            "No teacher's comment available.";

    }


    if (principalComment) {

        principalComment.textContent =
            "No principal's comment available.";

    }


    reportPresent.textContent =
        "-";


    reportAbsent.textContent =
        "-";


    reportLate.textContent =
        "-";


    reportAttendanceRate.textContent =
        "-";

}


/* =========================================================
   REPORT ATTENDANCE
========================================================= */

async function loadReportAttendance(
    studentId,
    session,
    term
) {

    try {

        const attendanceRef =
            collection(
                db,
                "attendanceRecords"
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


        let present = 0;

        let absent = 0;

        let late = 0;


        snapshot.forEach(
            document => {

                const record =
                    document.data();


                if (
                    record.status ===
                    "present"
                )
                    present++;


                else if (
                    record.status ===
                    "absent"
                )
                    absent++;


                else if (
                    record.status ===
                    "late"
                )
                    late++;

            }
        );


        const total =
            present +
            absent +
            late;


        const rate =
            total > 0
                ? (
                    present /
                    total *
                    100
                ).toFixed(2)
                : 0;


        reportPresent.textContent =
            present;


        reportAbsent.textContent =
            absent;


        reportLate.textContent =
            late;


        reportAttendanceRate.textContent =
            total > 0
                ? `${rate}%`
                : "-";


    } catch (error) {

        console.error(
            "Report attendance error:",
            error
        );


        reportPresent.textContent =
            "-";

        reportAbsent.textContent =
            "-";

        reportLate.textContent =
            "-";

        reportAttendanceRate.textContent =
            "-";

    }

}


/* =========================================================
   REPORT FILTER
========================================================= */

if (reportSessionFilter) {

    reportSessionFilter.addEventListener(
        "change",
        () => {

            clearReportDetails();

        }
    );

}


if (reportTermFilter) {

    reportTermFilter.addEventListener(
        "change",
        () => {

            clearReportDetails();

        }
    );

}


/* =========================================================
   DOWNLOAD / PRINT REPORT
========================================================= */

if (downloadReportBtn) {

    downloadReportBtn.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

const portalLinks =
    document.querySelectorAll(
        ".portal-link"
    );


const sections =
    document.querySelectorAll(
        ".portal-section"
    );


portalLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const section =
                    link.dataset.section;


                showSection(
                    section
                );

            }
        );

    }
);


/* =========================================================
   VIEW ALL / DATA-SECTION BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-section]"
    )
    .forEach(
        button => {

            if (
                !button.classList.contains(
                    "portal-link"
                )
            ) {

                button.addEventListener(
                    "click",
                    () => {

                        showSection(
                            button.dataset.section
                        );

                    }
                );

            }

        }
    );


/* =========================================================
   SHOW SECTION
========================================================= */

function showSection(
    sectionName
) {

    sections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    portalLinks.forEach(
        link => {

            link.classList.remove(
                "active"
            );

        }
    );


    const target =
        sectionName === "attendance"

            ? document.getElementById(
                "attendanceSection"
            )

            : document.getElementById(
                sectionName
            );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    const activeLink =
        document.querySelector(
            `.portal-link[data-section="${sectionName}"]`
        );


    if (activeLink) {

        activeLink.classList.add(
            "active"
        );

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );


                window.location.href =
                    "parent-login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   NO STUDENT
========================================================= */

function showNoStudent() {

    studentName.textContent =
        "No student found";


    studentClass.textContent =
        "-";


    admissionNo.textContent =
        "-";


    average.textContent =
        "-";


    position.textContent =
        "-";


    attendance.textContent =
        "-";


    subjectCount.textContent =
        "-";


    recentResults.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="loading"
            >
                Your account has not yet
                been linked to a student.
            </td>

        </tr>

    `;


    clearReportDetails();

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
   VALUE OR DASH
========================================================= */

function valueOrDash(
    value
) {

    return (
        value === undefined ||
        value === null ||
        value === ""
    )

        ? "-"

        : safe(value);

}


/* =========================================================
   HTML SECURITY
========================================================= */

function safe(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "-";

    }


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