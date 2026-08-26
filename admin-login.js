import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase-config.js";


/* =========================
   ADMIN LOGIN
========================= */

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

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


            const submitButton =
                adminLoginForm.querySelector(
                    'button[type="submit"]'
                );


            error.textContent = "";


            if (!username || !password) {

                error.textContent =
                    "Please enter your email and password.";

                return;

            }


            try {

                /*
                 * Firebase Authentication
                 *
                 * The username field should contain
                 * the Firebase administrator email.
                 */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Signing in...";

                }


                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        username,
                        password
                    );


                const user =
                    userCredential.user;


                /*
                 * Save basic session information.
                 *
                 * Firebase Authentication itself
                 * remains the real authentication system.
                 */

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "adminUsername",
                    user.email
                );


                sessionStorage.setItem(
                    "adminUid",
                    user.uid
                );


                /*
                 * Go to dashboard
                 */

                window.location.href =
                    "dashboard.html";

            }

            catch (firebaseError) {

                console.error(
                    "Firebase login error:",
                    firebaseError
                );


                let message =
                    "Unable to sign in. Please try again.";


                switch (
                    firebaseError.code
                ) {

                    case "auth/invalid-credential":

                        message =
                            "Invalid email or password.";

                        break;


                    case "auth/invalid-email":

                        message =
                            "Please enter a valid email address.";

                        break;


                    case "auth/user-not-found":

                        message =
                            "No administrator account was found with this email.";

                        break;


                    case "auth/wrong-password":

                        message =
                            "Incorrect password.";

                        break;


                    case "auth/too-many-requests":

                        message =
                            "Too many failed attempts. Please try again later.";

                        break;


                    case "auth/operation-not-allowed":

                        message =
                            "Email/password authentication is not enabled in Firebase.";

                        break;


                    case "auth/network-request-failed":

                        message =
                            "Network error. Please check your internet connection.";

                        break;


                    case "auth/unauthorized-domain":

                        message =
                            "This website domain is not authorized in Firebase.";

                        break;

                }


                error.textContent =
                    message;

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Login";

                }

            }

        }
    );

}


/* =========================
   PROTECT ADMIN PAGES
========================= */

const currentPage =
    window.location.pathname;


const isLoginPage =
    currentPage.endsWith(
        "login.html"
    ) ||
    currentPage.endsWith(
        "/"
    );


/*
 * Pages that require authentication
 */

if (!isLoginPage) {

    onAuthStateChanged(
        auth,
        function (user) {

            if (!user) {

                /*
                 * Firebase says the user is
                 * not authenticated.
                 */

                sessionStorage.removeItem(
                    "adminLoggedIn"
                );

                sessionStorage.removeItem(
                    "adminUsername"
                );

                sessionStorage.removeItem(
                    "adminUid"
                );


                window.location.href =
                    "login.html";

                return;

            }


            /*
             * User is authenticated.
             */

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            sessionStorage.setItem(
                "adminUsername",
                user.email
            );


            sessionStorage.setItem(
                "adminUid",
                user.uid
            );


            updateAdminUser(
                user.email
            );

        }
    );

}


/* =========================
   DASHBOARD
========================= */

async function loadDashboardCounts() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    if (!totalStudents)
        return;


    try {

        const studentsSnapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        totalStudents.textContent =
            studentsSnapshot.size;


    }

    catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        totalStudents.textContent =
            "0";

    }


    const totalTeachers =
        document.getElementById(
            "totalTeachers"
        );


    if (totalTeachers) {

        try {

            const teachersSnapshot =
                await getDocs(
                    collection(
                        db,
                        "teachers"
                    )
                );


            totalTeachers.textContent =
                teachersSnapshot.size;

        }

        catch (error) {

            console.error(
                "Error loading teachers:",
                error
            );


            totalTeachers.textContent =
                "0";

        }

    }


    const totalApplications =
        document.getElementById(
            "totalApplications"
        );


    if (totalApplications) {

        try {

            const applicationsSnapshot =
                await getDocs(
                    collection(
                        db,
                        "admissions"
                    )
                );


            totalApplications.textContent =
                applicationsSnapshot.size;

        }

        catch (error) {

            console.error(
                "Error loading admissions:",
                error
            );


            totalApplications.textContent =
                "0";

        }

    }


    const totalMessages =
        document.getElementById(
            "totalMessages"
        );


    if (totalMessages) {

        try {

            const messagesSnapshot =
                await getDocs(
                    collection(
                        db,
                        "messages"
                    )
                );


            totalMessages.textContent =
                messagesSnapshot.size;

        }

        catch (error) {

            console.error(
                "Error loading messages:",
                error
            );


            totalMessages.textContent =
                "0";

        }

    }

}


loadDashboardCounts();


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
        async function (event) {

            event.preventDefault();


            try {

                await signOut(auth);


                sessionStorage.removeItem(
                    "adminLoggedIn"
                );

                sessionStorage.removeItem(
                    "adminUsername"
                );

                sessionStorage.removeItem(
                    "adminUid"
                );


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to logout. Please try again."
                );

            }

        }
    );

}


/* =========================
   ADMIN USER
========================= */

function updateAdminUser(
    email
) {

    const adminUser =
        document.getElementById(
            "adminUser"
        );


    if (adminUser) {

        adminUser.textContent =
            email || "Administrator";

    }

}


/* =========================
   INITIAL AUTH USER
========================= */

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            updateAdminUser(
                user.email
            );

        }

    }
);