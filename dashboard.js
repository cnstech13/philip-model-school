/* =========================================================
   PHILIP MODEL SCHOOL
   DASHBOARD.JS
   FIRESTORE VERSION
========================================================= */

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


/* =========================================================
   FIRESTORE COLLECTIONS
========================================================= */

const studentsCollection =
    collection(db, "students");

const teachersCollection =
    collection(db, "teachers");

const classesCollection =
    collection(db, "classes");

const subjectsCollection =
    collection(db, "subjects");


/* =========================================================
   HELPER
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

async function updateDashboardStats() {

    try {

        /*
         * Load all four collections
         */

        const [
            studentsSnapshot,
            teachersSnapshot,
            classesSnapshot,
            subjectsSnapshot
        ] = await Promise.all([

            getDocs(
                studentsCollection
            ),

            getDocs(
                teachersCollection
            ),

            getDocs(
                classesCollection
            ),

            getDocs(
                subjectsCollection
            )

        ]);


        /*
         * Get the number of documents
         */

        const totalStudents =
            studentsSnapshot.size;

        const totalTeachers =
            teachersSnapshot.size;

        const totalClasses =
            classesSnapshot.size;

        const totalSubjects =
            subjectsSnapshot.size;


        /*
         * Display statistics
         */

        setText(
            "totalStudents",
            totalStudents
        );

        setText(
            "totalTeachers",
            totalTeachers
        );

        setText(
            "totalClasses",
            totalClasses
        );

        setText(
            "totalSubjects",
            totalSubjects
        );


        console.log(
            "Dashboard statistics updated:",
            {
                students: totalStudents,
                teachers: totalTeachers,
                classes: totalClasses,
                subjects: totalSubjects
            }
        );

    }

    catch (error) {

        console.error(
            "Error loading dashboard statistics:",
            error
        );


        /*
         * Keep the dashboard usable
         */

        setText(
            "totalStudents",
            "0"
        );

        setText(
            "totalTeachers",
            "0"
        );

        setText(
            "totalClasses",
            "0"
        );

        setText(
            "totalSubjects",
            "0"
        );


        console.error(
            "Make sure Firestore rules allow the admin to read these collections."
        );

    }

}


/* =========================================================
   CURRENT DATE
========================================================= */

function displayCurrentDate() {

    const date =
        new Date();


    setText(
        "currentDate",

        date.toLocaleDateString(
            "en-NG",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
    );

}


/* =========================================================
   TODAY'S ATTENDANCE
========================================================= */

async function updateTodayAttendance() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        let present = 0;

        let absent = 0;

        let late = 0;


        snapshot.forEach(
            documentSnapshot => {

                const record =
                    documentSnapshot.data();


                if (
                    record.date !==
                    today
                ) {

                    return;

                }


                const status =
                    String(
                        record.status || ""
                    ).toLowerCase();


                if (
                    status ===
                    "present"
                ) {

                    present++;

                }

                else if (
                    status ===
                    "absent"
                ) {

                    absent++;

                }

                else if (
                    status ===
                    "late"
                ) {

                    late++;

                }

            }
        );


        /*
         * Update attendance numbers
         */

        const numbers =
            document.querySelectorAll(
                ".attendance-number"
            );


        if (
            numbers.length >= 3
        ) {

            numbers[0].textContent =
                present;

            numbers[1].textContent =
                absent;

            numbers[2].textContent =
                late;

        }

    }

    catch (error) {

        console.error(
            "Error loading today's attendance:",
            error
        );

    }

}


/* =========================================================
   RECENT ACTIVITIES
========================================================= */

async function loadRecentActivities() {

    const activityList =
        document.getElementById(
            "activityList"
        );


    if (!activityList) {

        return;

    }


    /*
     * We can still use localStorage
     * for dashboard activities if your
     * other pages are storing them there.
     */

    let activities = [];


    try {

        activities =
            JSON.parse(
                localStorage.getItem(
                    "schoolActivities"
                )
            ) || [];

    }

    catch (error) {

        console.error(
            "Error loading activities:",
            error
        );

        activities = [];

    }


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

                        ${escapeHTML(
                            activity.icon ||
                            "📌"
                        )}

                    </div>


                    <div>

                        <strong>

                            ${escapeHTML(
                                activity.title ||
                                ""
                            )}

                        </strong>


                        <small>

                            ${escapeHTML(
                                activity.time ||
                                ""
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
   INITIALIZE DASHBOARD
========================================================= */

async function initializeDashboard() {

    /*
     * Display date immediately
     */

    displayCurrentDate();


    /*
     * Load Firestore statistics
     */

    await updateDashboardStats();


    /*
     * Load today's attendance
     */

    await updateTodayAttendance();


    /*
     * Load recent activities
     */

    await loadRecentActivities();

}


/* =========================================================
   START
========================================================= */

initializeDashboard();