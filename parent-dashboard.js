import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";


import {
    collection,
    query,
    where,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


import {
    auth,
    db
}
from "./firebase-config.js";


/* =========================
   ELEMENTS
========================= */

const childrenGrid =
    document.getElementById(
        "childrenGrid"
    );


const parentName =
    document.getElementById(
        "parentName"
    );


const welcomeName =
    document.getElementById(
        "welcomeName"
    );


const parentAvatar =
    document.getElementById(
        "parentAvatar"
    );


const overallAverage =
    document.getElementById(
        "overallAverage"
    );


const performanceStatus =
    document.getElementById(
        "performanceStatus"
    );


const attendanceRate =
    document.getElementById(
        "attendanceRate"
    );


const outstandingFees =
    document.getElementById(
        "outstandingFees"
    );


const recentResultsBody =
    document.getElementById(
        "recentResultsBody"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


/* =========================
   MOBILE MENU
========================= */

menuToggle.addEventListener(
    "click",
    function () {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            window.location.href =
                "parent-login.html";

            return;
        }


        console.log(
            "Authenticated parent:",
            user.uid
        );


        /*
         * Display basic Firebase
         * account information.
         */

        const email =
            user.email || "Parent";


        const name =
            user.displayName ||
            email.split("@")[0];


        setParentName(name);


        /*
         * Load children linked
         * to this parent's UID.
         */

        await loadChildren(
            user.uid
        );

    }
);


/* =========================
   PARENT NAME
========================= */

function setParentName(name) {

    const formattedName =
        formatName(name);


    parentName.textContent =
        formattedName;


    welcomeName.textContent =
        formattedName;


    parentAvatar.textContent =
        getInitials(formattedName);

}


/* =========================
   LOAD CHILDREN
========================= */

async function loadChildren(
    parentUid
) {

    childrenGrid.innerHTML = `

        <div class="loading-card">

            <div class="loader"></div>

            <p>
                Loading your children...
            </p>

        </div>

    `;


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        const studentsQuery =
            query(
                studentsRef,
                where(
                    "parentId",
                    "==",
                    parentUid
                )
            );


        const snapshot =
            await getDocs(
                studentsQuery
            );


        if (snapshot.empty) {

            childrenGrid.innerHTML = `

                <div class="empty-card">

                    <h3>
                        No children found
                    </h3>

                    <p>
                        No student has been linked
                        to this parent account yet.
                    </p>

                </div>

            `;

            return;
        }


        childrenGrid.innerHTML = "";


        let students = [];


        snapshot.forEach(
            function (doc) {

                students.push({
                    id: doc.id,
                    ...doc.data()
                });

            }
        );


        /*
         * Display each child.
         */

       students.forEach(
    function (student) {

        createChildCard(
            student
        );

    }
);


// Load results for the first child

if (students.length > 0) {

    await loadStudentResults(
        students[0].id
    );

}


        /*
         * Calculate dashboard
         * overview.
         */

        calculateOverview(
            students
        );


    } catch (error) {

        console.error(
            "Error loading children:",
            error
        );


        childrenGrid.innerHTML = `

            <div class="empty-card">

                <h3>
                    Unable to load children
                </h3>

                <p>
                    Please check your internet
                    connection and try again.
                </p>

            </div>

        `;

    }

}


async function loadStudentResults(studentId) {

    try {

        const resultsRef =
            collection(db, "results");

        const resultsQuery =
            query(
                resultsRef,
                where(
                    "studentId",
                    "==",
                    studentId
                )
            );

        const snapshot =
            await getDocs(resultsQuery);

        recentResultsBody.innerHTML = "";

        if (snapshot.empty) {

            recentResultsBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="table-loading">
                        No results available yet.
                    </td>
                </tr>
            `;

            return;
        }

        snapshot.forEach(doc => {

            const result = doc.data();

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        result.subject || "-"
                    )}
                </td>

                <td>
                    ${
                        Number(result.ca1 || 0) +
                        Number(result.ca2 || 0)
                    }
                </td>

                <td>
                    ${Number(result.exam || 0)}
                </td>

                <td>
                    ${Number(result.total || 0)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            result.grade || "-"
                        )}
                    </strong>
                </td>

            `;

            recentResultsBody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );

        recentResultsBody.innerHTML = `
            <tr>
                <td colspan="5"
                    class="table-loading">
                    Unable to load results.
                </td>
            </tr>
        `;

    }

}
/* =========================
   CREATE CHILD CARD
========================= */

function createChildCard(
    student
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "child-card";


    const name =
        student.name ||
        "Unnamed Student";


    const className =
        student.className ||
        "Class not assigned";


    const average =
        student.average !== undefined
            ? student.average + "%"
            : "--";


    const position =
        student.position ||
        "--";


    const attendance =
        student.attendance !== undefined
            ? student.attendance + "%"
            : "--";


    card.innerHTML = `

        <div class="child-header">

            <div class="child-avatar">

                ${getInitials(name)}

            </div>


            <div>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(className)}
                </p>

            </div>

        </div>


        <div class="child-stats">

            <div class="child-stat">

                <strong>
                    ${average}
                </strong>

                <span>
                    Average
                </span>

            </div>


            <div class="child-stat">

                <strong>
                    ${escapeHTML(
                        String(position)
                    )}
                </strong>

                <span>
                    Position
                </span>

            </div>


            <div class="child-stat">

                <strong>
                    ${attendance}
                </strong>

                <span>
                    Attendance
                </span>

            </div>

        </div>

    `;


    childrenGrid.appendChild(
        card
    );

}


/* =========================
   OVERVIEW
========================= */

function calculateOverview(
    students
) {

    if (!students.length) {
        return;
    }


    const averages =
        students
            .map(
                student =>
                    Number(
                        student.average
                    )
            )
            .filter(
                value =>
                    !isNaN(value)
            );


    const attendances =
        students
            .map(
                student =>
                    Number(
                        student.attendance
                    )
            )
            .filter(
                value =>
                    !isNaN(value)
            );


    if (averages.length) {

        const average =
            averages.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / averages.length;


        overallAverage.textContent =
            average.toFixed(1) + "%";


        performanceStatus.textContent =
            getPerformanceStatus(
                average
            );

    }


    if (attendances.length) {

        const attendance =
            attendances.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / attendances.length;


        attendanceRate.textContent =
            attendance.toFixed(1) + "%";

    }


    /*
     * Fees will later be calculated
     * from the fees collection.
     */

    outstandingFees.textContent =
        "--";

}


/* =========================
   PERFORMANCE
========================= */

function getPerformanceStatus(
    average
) {

    if (average >= 80) {
        return "Excellent";
    }


    if (average >= 70) {
        return "Very Good";
    }


    if (average >= 60) {
        return "Good";
    }


    if (average >= 50) {
        return "Fair";
    }


    return "Needs Improvement";

}


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async function () {

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


/* =========================
   INITIALS
========================= */

function getInitials(
    name
) {

    if (!name) {
        return "P";
    }


    const parts =
        name
            .trim()
            .split(/\s+/);


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/* =========================
   FORMAT NAME
========================= */

function formatName(
    name
) {

    return name
        .replace(
            /[._-]/g,
            " "
        )
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


/* =========================
   SECURITY
========================= */

function escapeHTML(
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