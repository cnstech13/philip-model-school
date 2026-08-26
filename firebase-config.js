// ================================
// FIREBASE CONFIGURATION
// Philip Model School
// ================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


// Firebase configuration

const firebaseConfig = {

    apiKey:
        "AIzaSyCsCNrJHjKYsApg6v-LKtPmidVmGurPgEc",

    authDomain:
        "philip-model-school.firebaseapp.com",

    projectId:
        "philip-model-school",

    storageBucket:
        "philip-model-school.firebasestorage.app",

    messagingSenderId:
        "825793655687",

    appId:
        "1:825793655687:web:90dd2b06e0df3e317ad922",

    measurementId:
        "G-XKNQ1S21YY"
};


// Initialize Firebase

const app =
    initializeApp(firebaseConfig);


// Initialize Authentication

const auth =
    getAuth(app);


// Initialize Firestore

const db =
    getFirestore(app);


// Export services

export {
    app,
    auth,
    db
};