/* =================================
   DASHBOARD DATA
================================= */

function getData(key) {

    return JSON.parse(
        localStorage.getItem(key)
    ) || [];

}


/* =================================
   UPDATE STATISTICS
================================= */

function updateDashboardStats() {

    const students =
        getData("students");

    const teachers =
        getData("teachers");

    const classes =
        getData("classes");

    const subjects =
        getData("subjects");


    document.getElementById(
        "totalStudents"
    ).textContent =
        students.length;


    document.getElementById(
        "totalTeachers"
    ).textContent =
        teachers.length;


    document.getElementById(
        "totalClasses"
    ).textContent =
        classes.length;


    document.getElementById(
        "totalSubjects"
    ).textContent =
        subjects.length;

}


/* =================================
   DATE
================================= */

function displayCurrentDate() {

    const date =
        new Date();


    document.getElementById(
        "currentDate"
    ).textContent =
        date.toLocaleDateString(
            "en-NG",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* =================================
   ATTENDANCE TODAY
================================= */

function updateTodayAttendance() {

    const records =
        getData(
            "attendanceRecords"
        );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayRecords =
        records.filter(
            record =>
                record.date === today
        );


    const present =
        todayRecords.filter(
            record =>
                record.status ===
                "present"
        ).length;


    const absent =
        todayRecords.filter(
            record =>
                record.status ===
                "absent"
        ).length;


    const late =
        todayRecords.filter(
            record =>
                record.status ===
                "late"
        ).length;


    const numbers =
        document.querySelectorAll(
            ".attendance-number"
        );


    if (numbers.length >= 3) {

        numbers[0].textContent =
            present;

        numbers[1].textContent =
            absent;

        numbers[2].textContent =
            late;

    }

}


/* =================================
   RECENT ACTIVITIES
================================= */

function loadRecentActivities() {

    const activityList =
        document.getElementById(
            "activityList"
        );


    const activities =
        getData(
            "schoolActivities"
        );


    if (
        activities.length === 0
    ) {

        activityList.innerHTML = `

            <div class="empty-activity">

                No recent activities.

            </div>

        `;

        return;

    }


    activityList.innerHTML =
        "";


    activities
        .slice(-5)
        .reverse()
        .forEach(
            activity => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "activity-item";


                div.innerHTML = `

                    <div class="activity-icon">
                        ${activity.icon || "📌"}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                activity.title
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                activity.time || ""
                            )}
                        </small>

                    </div>

                `;


                activityList.appendChild(
                    div
                );

            }
        );

}


/* =================================
   ESCAPE HTML
================================= */

function escapeHTML(value) {

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


/* =================================
   INITIALIZE
================================= */

updateDashboardStats();

displayCurrentDate();

updateTodayAttendance();

loadRecentActivities();