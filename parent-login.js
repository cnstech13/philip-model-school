import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
}
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    auth
}
from "./firebase-config.js";


/* =========================
   ELEMENTS
========================= */

const form =
    document.getElementById(
        "parentLoginForm"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const rememberMe =
    document.getElementById(
        "rememberMe"
    );


const loginBtn =
    document.getElementById(
        "loginBtn"
    );


const loginBtnText =
    document.getElementById(
        "loginBtnText"
    );


const message =
    document.getElementById(
        "loginMessage"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


/* =========================
   MESSAGE
========================= */

function showMessage(
    text,
    type = "error"
) {

    message.textContent = text;

    message.className =
        `login-message show ${type}`;

}


/* =========================
   PASSWORD VISIBILITY
========================= */

togglePassword.addEventListener(
    "click",
    function () {

        const isPassword =
            passwordInput.type === "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        togglePassword.textContent =
            isPassword
                ? "🙈"
                : "👁";

    }
);


/* =========================
   LOGIN
========================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        if (!email || !password) {

            showMessage(
                "Please enter your email and password."
            );

            return;
        }


        loginBtn.disabled = true;

        loginBtnText.textContent =
            "Signing in...";


        try {

            /*
             * Remember-me support
             */

            await setPersistence(
                auth,
                rememberMe.checked
                    ? browserLocalPersistence
                    : browserSessionPersistence
            );


            /*
             * Firebase login
             */

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            console.log(
                "Parent logged in:",
                user.uid
            );


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "portal.html";

                },
                800
            );


        } catch (error) {

            console.error(error);


            let errorMessage =
                "Unable to sign in. Please try again.";


            switch (error.code) {

                case "auth/invalid-credential":

                    errorMessage =
                        "Incorrect email or password.";

                    break;


                case "auth/user-not-found":

                    errorMessage =
                        "No parent account was found with this email.";

                    break;


                case "auth/wrong-password":

                    errorMessage =
                        "Incorrect password.";

                    break;


                case "auth/invalid-email":

                    errorMessage =
                        "Please enter a valid email address.";

                    break;


                case "auth/too-many-requests":

                    errorMessage =
                        "Too many login attempts. Please try again later.";

                    break;

            }


            showMessage(
                errorMessage
            );


            loginBtn.disabled = false;

            loginBtnText.textContent =
                "Sign In";

        }

    }
);


/* =========================
   FORGOT PASSWORD
========================= */

forgotPassword.addEventListener(
    "click",
    async function (event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        if (!email) {

            showMessage(
                "Enter your email address first."
            );

            emailInput.focus();

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            showMessage(
                "Password reset instructions have been sent to your email.",
                "success"
            );


        } catch (error) {

            console.error(error);


            showMessage(
                "Unable to send the password reset email."
            );

        }

    }
);