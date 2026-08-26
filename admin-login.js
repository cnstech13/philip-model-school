// ======================================================
// PHILIP MODEL SCHOOL
// ADMIN LOGIN + FIREBASE AUTHENTICATION
// ======================================================

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


// ======================================================
// ADMIN LOGIN CREDENTIALS
// ======================================================

// These are the credentials the administrator enters
// on your existing login page.

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";


// This is the Firebase Authentication account
// you created in Firebase Console.

const FIREBASE_ADMIN_EMAIL =
    "admin@philipmodelschool.com";


// IMPORTANT:
// Put the SAME password here that you used when
// creating the Firebase Authentication user.

const FIREBASE_ADMIN_PASSWORD =
    "YOUR_FIREBASE_PASSWORD";


// ======================================================
// LOGIN FORM
// ======================================================

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const error =
                document.getElementById(
                    "loginError"
                );


            const loginButton =
                adminLoginForm.querySelector(
                    'button[type="submit"]'
                );


            error.textContent = "";


            // ==================================================
            // CHECK YOUR NORMAL ADMIN LOGIN
            // ==================================================

            if (
                username !== ADMIN_USERNAME ||
                password !== ADMIN_PASSWORD
            ) {

                error.textContent =
                    "Invalid username or password.";

                return;

            }


            try {

                // Disable button while Firebase signs in

                if (loginButton) {

                    loginButton.disabled = true;

                    loginButton.textContent =
                        "Signing in...";

                }


                // ==================================================
                // FIREBASE AUTHENTICATION
                // ==================================================

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        FIREBASE_ADMIN_EMAIL,
                        FIREBASE_ADMIN_PASSWORD
                    );


                const user =
                    userCredential.user;


                // ==================================================
                // SAVE ADMIN SESSION
                // ==================================================

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "adminUsername",
                    "admin"
                );


                sessionStorage.setItem(
                    "adminUid",
                    user.uid
                );


                // ==================================================
                // GO TO DASHBOARD
                // ==================================================

                window.location.href =
                    "dashboard.html";

            }

            catch (errorObject) {

                console.error(
                    "Firebase authentication error:",
                    errorObject
                );


                let message =
                    "Unable to connect to Firebase.";


                switch (
                    errorObject.code
                ) {

                    case "auth/invalid-credential":

                        message =
                            "Firebase admin account or password is incorrect.";

                        break;


                    case "auth/user-not-found":

                        message =
                            "The Firebase admin account does not exist.";

                        break;


                    case "auth/wrong-password":

                        message =
                            "The Firebase admin password is incorrect.";

                        break;


                    case "auth/invalid-email":

                        message =
                            "The Firebase admin email is invalid.";

                        break;


                    case "auth/operation-not-allowed":

                        message =
                            "Email/password authentication is not enabled in Firebase.";

                        break;


                    case "auth/unauthorized-domain":

                        message =
                            "Your Vercel domain is not authorized in Firebase.";

                        break;


                    case "auth/network-request-failed":

                        message =
                            "Network error. Check your internet connection.";

                        break;


                    case "auth/too-many-requests":

                        message =
                            "Too many login attempts. Try again later.";

                        break;

                }


                error.textContent =
                    message;

            }

            finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";

                }

            }

        }
    );

}


// ======================================================
// PROTECT ADMIN PAGES
// ======================================================

const currentPage =
    window.location.pathname;


const loginPage =
    currentPage.endsWith(
        "login.html"
    );


if (!loginPage) {

    onAuthStateChanged(
        auth,
        function (user) {

            if (!user) {

                sessionStorage.clear();

                window.location.href =
                    "login.html";

                return;

            }


            // Firebase confirms authentication

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            sessionStorage.setItem(
                "adminUsername",
                "admin"
            );


            sessionStorage.setItem(
                "adminUid",
                user.uid
            );


            updateAdminUser();

        }
    );

}


// ======================================================
// LOGOUT
// ======================================================

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


                sessionStorage.clear();


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Unable to logout."
                );

            }

        }
    );

}


// ======================================================
// DISPLAY ADMIN NAME
// ======================================================

function updateAdminUser() {

    const adminUser =
        document.getElementById(
            "adminUser"
        );


    if (adminUser) {

        adminUser.textContent =
            "Administrator";

    }

}


// ======================================================
// DASHBOARD COUNTS
// ======================================================

async function loadDashboardCounts() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    // Not the dashboard page

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
            "Students count error:",
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

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "teachers"
                    )
                );


            totalTeachers.textContent =
                snapshot.size;

        }

        catch (error) {

            console.error(
                "Teachers count error:",
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

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "admissions"
                    )
                );


            totalApplications.textContent =
                snapshot.size;

        }

        catch (error) {

            console.error(
                "Admissions count error:",
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

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "messages"
                    )
                );


            totalMessages.textContent =
                snapshot.size;

        }

        catch (error) {

            console.error(
                "Messages count error:",
                error
            );

            totalMessages.textContent =
                "0";

        }

    }

}


loadDashboardCounts();