/* =========================
   ADMIN LOGIN
========================= */

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "username"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const error =
                document.getElementById(
                    "loginError"
                );


            /*
             * TEMPORARY LOCAL LOGIN
             *
             * We will replace this with
             * a proper backend authentication
             * system later.
             */

            const ADMIN_USERNAME = "admin";

            const ADMIN_PASSWORD = "admin123";


            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "adminUsername",
                    username
                );


                window.location.href =
                    "dashboard.html";

            }

            else {

                error.textContent =
                    "Invalid username or password.";

            }

        }
    );

}

/* =========================
   ADMIN AUTHENTICATION
========================= */

const currentPage =
    window.location.pathname;


if (
    currentPage.includes("/admin/") &&
    !currentPage.endsWith("login.html")
) {

    const loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn !== "true") {

        window.location.href =
            "login.html";

    }

}


/* =========================
   DASHBOARD
========================= */

const totalStudents =
    document.getElementById(
        "totalStudents"
    );


if (totalStudents) {

    const students =
        JSON.parse(
            localStorage.getItem(
                "students"
            )
        ) || [];


    totalStudents.textContent =
        students.length;


    const teachers =
        JSON.parse(
            localStorage.getItem(
                "teachers"
            )
        ) || [];


    document.getElementById(
        "totalTeachers"
    ).textContent =
        teachers.length;


    const applications =
        JSON.parse(
            localStorage.getItem(
                "schoolApplications"
            )
        ) || [];


    document.getElementById(
        "totalApplications"
    ).textContent =
        applications.length;


    const messages =
        JSON.parse(
            localStorage.getItem(
                "schoolMessages"
            )
        ) || [];


    document.getElementById(
        "totalMessages"
    ).textContent =
        messages.length;

}


/* =========================
   LOGOUT
========================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            sessionStorage.removeItem(
                "adminLoggedIn"
            );


            sessionStorage.removeItem(
                "adminUsername"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =========================
   ADMIN USER
========================= */

const adminUser =
    document.getElementById(
        "adminUser"
    );


if (adminUser) {

    adminUser.textContent =
        sessionStorage.getItem(
            "adminUsername"
        ) || "Administrator";

}