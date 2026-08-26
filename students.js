// ============================================================
// STUDENTS MANAGEMENT
// Philip Model School
// Firebase 12 Modular Firestore
// ============================================================

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


// ============================================================
// STUDENTS DATA
// ============================================================

let students = [];


// ============================================================
// FIRESTORE COLLECTION
// ============================================================

const studentsCollection =
    collection(db, "students");


// ============================================================
// ELEMENTS
// ============================================================

const studentModal =
    document.getElementById("studentModal");

const studentForm =
    document.getElementById("studentForm");

const studentsTableBody =
    document.getElementById("studentsTableBody");

const emptyStudents =
    document.getElementById("emptyStudents");

const studentSearch =
    document.getElementById("studentSearch");

const classFilter =
    document.getElementById("classFilter");

const addStudentBtn =
    document.getElementById("addStudentBtn");

const closeStudentModal =
    document.getElementById("closeStudentModal");

const cancelStudentBtn =
    document.getElementById("cancelStudentBtn");

const saveStudentBtn =
    studentForm?.querySelector(
        'button[type="submit"]'
    );


// ============================================================
// CHECK REQUIRED ELEMENTS
// ============================================================

if (!studentModal) {
    console.error("studentModal was not found.");
}

if (!studentForm) {
    console.error("studentForm was not found.");
}

if (!studentsTableBody) {
    console.error("studentsTableBody was not found.");
}

if (!addStudentBtn) {
    console.error("addStudentBtn was not found.");
}


// ============================================================
// GENERATE STUDENT ID
// ============================================================

function generateStudentId() {

    const year =
        new Date().getFullYear();

    let number =
        students.length + 1;

    let id =
        `STU-${year}-${String(number).padStart(4, "0")}`;


    while (
        students.some(
            student =>
                student.id === id
        )
    ) {

        number++;

        id =
            `STU-${year}-${String(number).padStart(4, "0")}`;

    }


    return id;

}


// ============================================================
// LOAD STUDENTS FROM FIRESTORE
// ============================================================

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                studentsCollection
            );


        students =
            snapshot.docs.map(
                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })
            );


        renderStudents();

    }

    catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        students = [];

        renderStudents();


        alert(
            "Unable to load students from Firestore.\n\n" +
            getFirebaseErrorMessage(error)
        );

    }

}


// ============================================================
// OPEN STUDENT MODAL
// ============================================================

function openStudentModal(
    student = null
) {

    if (!studentModal)
        return;


    studentModal.classList.add(
        "show"
    );


    if (student) {

        // ----------------------------------------------------
        // EDIT MODE
        // ----------------------------------------------------

        document.getElementById(
            "modalTitle"
        ).textContent =
            "Edit Student";


        document.getElementById(
            "editingStudentId"
        ).value =
            student.firestoreId || "";


        document.getElementById(
            "firstName"
        ).value =
            student.firstName || "";


        document.getElementById(
            "lastName"
        ).value =
            student.lastName || "";


        document.getElementById(
            "dateOfBirth"
        ).value =
            student.dateOfBirth || "";


        document.getElementById(
            "gender"
        ).value =
            student.gender || "";


        document.getElementById(
            "studentClass"
        ).value =
            student.studentClass || "";


        document.getElementById(
            "admissionDate"
        ).value =
            student.admissionDate || "";


        document.getElementById(
            "parentName"
        ).value =
            student.parentName || "";


        document.getElementById(
            "parentPhone"
        ).value =
            student.parentPhone || "";


        document.getElementById(
            "parentEmail"
        ).value =
            student.parentEmail || "";


        document.getElementById(
            "studentStatus"
        ).value =
            student.status || "Active";


        document.getElementById(
            "studentAddress"
        ).value =
            student.address || "";

    }

    else {

        // ----------------------------------------------------
        // ADD MODE
        // ----------------------------------------------------

        studentForm.reset();


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Add Student";


        document.getElementById(
            "editingStudentId"
        ).value =
            "";


        document.getElementById(
            "studentStatus"
        ).value =
            "Active";

    }

}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeStudentModalFunction() {

    if (!studentModal)
        return;


    studentModal.classList.remove(
        "show"
    );


    studentForm.reset();


    document.getElementById(
        "editingStudentId"
    ).value =
        "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Student";


    if (saveStudentBtn) {

        saveStudentBtn.disabled =
            false;

        saveStudentBtn.textContent =
            "Save Student";

    }

}


// ============================================================
// OPEN MODAL BUTTON
// ============================================================

addStudentBtn.addEventListener(
    "click",
    function () {

        openStudentModal();

    }
);


// ============================================================
// CLOSE BUTTON
// ============================================================

closeStudentModal.addEventListener(
    "click",
    closeStudentModalFunction
);


// ============================================================
// CANCEL BUTTON
// ============================================================

cancelStudentBtn.addEventListener(
    "click",
    closeStudentModalFunction
);


// ============================================================
// CLOSE WHEN CLICKING OUTSIDE MODAL
// ============================================================

studentModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            studentModal
        ) {

            closeStudentModalFunction();

        }

    }
);


// ============================================================
// SAVE / UPDATE STUDENT
// ============================================================

studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ----------------------------------------------------
        // PREVENT DOUBLE CLICK
        // ----------------------------------------------------

        if (
            saveStudentBtn &&
            saveStudentBtn.disabled
        ) {

            return;

        }


        // ----------------------------------------------------
        // BUTTON STATE
        // ----------------------------------------------------

        if (saveStudentBtn) {

            saveStudentBtn.disabled =
                true;

            saveStudentBtn.textContent =
                "Saving...";

        }


        try {

            // ------------------------------------------------
            // GET EDITING ID
            // ------------------------------------------------

            const editingId =
                document.getElementById(
                    "editingStudentId"
                ).value.trim();


            // ------------------------------------------------
            // GET FORM VALUES
            // ------------------------------------------------

            const firstName =
                document.getElementById(
                    "firstName"
                ).value.trim();


            const lastName =
                document.getElementById(
                    "lastName"
                ).value.trim();


            const dateOfBirth =
                document.getElementById(
                    "dateOfBirth"
                ).value;


            const gender =
                document.getElementById(
                    "gender"
                ).value;


            const studentClass =
                document.getElementById(
                    "studentClass"
                ).value;


            const admissionDate =
                document.getElementById(
                    "admissionDate"
                ).value;


            const parentName =
                document.getElementById(
                    "parentName"
                ).value.trim();


            const parentPhone =
                document.getElementById(
                    "parentPhone"
                ).value.trim();


            const parentEmail =
                document.getElementById(
                    "parentEmail"
                ).value.trim();


            const status =
                document.getElementById(
                    "studentStatus"
                ).value;


            const address =
                document.getElementById(
                    "studentAddress"
                ).value.trim();


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !firstName ||
                !lastName ||
                !dateOfBirth ||
                !gender ||
                !studentClass ||
                !admissionDate ||
                !parentName ||
                !parentPhone
            ) {

                throw new Error(
                    "Please complete all required fields."
                );

            }


            // ------------------------------------------------
            // CHECK DUPLICATE NAME
            // ------------------------------------------------

            const duplicateStudent =
                students.find(
                    student =>

                        String(
                            student.firstName || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        firstName.toLowerCase()

                        &&

                        String(
                            student.lastName || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        lastName.toLowerCase()

                        &&

                        student.firestoreId !==
                        editingId
                );


            if (duplicateStudent) {

                throw new Error(
                    "A student with this name already exists."
                );

            }


            // ------------------------------------------------
            // STUDENT DATA
            // ------------------------------------------------

            const studentData = {

                firstName,

                lastName,

                dateOfBirth,

                gender,

                studentClass,

                admissionDate,

                parentName,

                parentPhone,

                parentEmail,

                status,

                address,

                updatedAt:
                    serverTimestamp()

            };


            // =================================================
            // EDIT EXISTING STUDENT
            // =================================================

            if (editingId) {

                const studentRef =
                    doc(
                        db,
                        "students",
                        editingId
                    );


                await updateDoc(
                    studentRef,
                    studentData
                );


                alert(
                    "Student updated successfully."
                );

            }


            // =================================================
            // ADD NEW STUDENT
            // =================================================

            else {

                const studentId =
                    generateStudentId();


                const newStudent = {

                    id:
                        studentId,

                    ...studentData,

                    createdAt:
                        serverTimestamp()

                };


                await addDoc(
                    studentsCollection,
                    newStudent
                );


                alert(
                    `Student added successfully.\n\nStudent ID: ${studentId}`
                );

            }


            // ------------------------------------------------
            // RELOAD DATA
            // ------------------------------------------------

            await loadStudents();


            // ------------------------------------------------
            // CLOSE MODAL
            // ------------------------------------------------

            closeStudentModalFunction();

        }

        catch (error) {

            console.error(
                "Error saving student:",
                error
            );


            alert(
                "Unable to save student.\n\n" +
                getFirebaseErrorMessage(error)
            );

        }

        finally {

            // ------------------------------------------------
            // ALWAYS RESTORE BUTTON
            // ------------------------------------------------

            if (saveStudentBtn) {

                saveStudentBtn.disabled =
                    false;

                saveStudentBtn.textContent =
                    "Save Student";

            }

        }

    }
);


// ============================================================
// RENDER STUDENTS
// ============================================================

function renderStudents() {

    const search =
        studentSearch
            ? studentSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedClass =
        classFilter
            ? classFilter.value
            : "";


    const filteredStudents =
        students.filter(
            student => {

                const fullName =
                    `${student.firstName || ""} ${student.lastName || ""}`
                        .toLowerCase();


                const studentId =
                    String(
                        student.id || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||

                    fullName.includes(
                        search
                    ) ||

                    studentId.includes(
                        search
                    );


                const matchesClass =
                    !selectedClass ||

                    student.studentClass ===
                    selectedClass;


                return (
                    matchesSearch &&
                    matchesClass
                );

            }
        );


    studentsTableBody.innerHTML =
        "";


    if (
        filteredStudents.length === 0
    ) {

        emptyStudents.style.display =
            "block";

        return;

    }


    emptyStudents.style.display =
        "none";


    filteredStudents.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            const firstInitial =
                student.firstName
                    ? student.firstName[0]
                    : "";


            const lastInitial =
                student.lastName
                    ? student.lastName[0]
                    : "";


            const initials =
                (
                    firstInitial +
                    lastInitial
                ).toUpperCase();


            row.innerHTML = `

                <td>

                    <span class="student-id">

                        ${escapeHTML(
                            student.id
                        )}

                    </span>

                </td>


                <td>

                    <div class="student-name">

                        <div class="student-avatar">

                            ${escapeHTML(
                                initials
                            )}

                        </div>


                        <strong>

                            ${escapeHTML(
                                student.firstName || ""
                            )}

                            ${escapeHTML(
                                student.lastName || ""
                            )}

                        </strong>

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                        student.gender || ""
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        student.studentClass || ""
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        student.parentPhone || ""
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${
                            student.status ===
                            "Active"

                                ? "status-active"

                                : "status-inactive"
                        }
                    ">

                        ${escapeHTML(
                            student.status || ""
                        )}

                    </span>

                </td>


                <td>

                    <div class="table-actions">


                        <button
                            type="button"
                            class="table-action"
                            title="Edit"
                            data-action="edit"
                            data-id="${escapeHTML(
                                student.firestoreId
                            )}"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="table-action"
                            title="Delete"
                            data-action="delete"
                            data-id="${escapeHTML(
                                student.firestoreId
                            )}"
                        >
                            🗑️
                        </button>


                    </div>

                </td>

            `;


            studentsTableBody.appendChild(
                row
            );

        }
    );

}


// ============================================================
// TABLE ACTIONS
// ============================================================

studentsTableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button)
            return;


        const action =
            button.dataset.action;


        const firestoreId =
            button.dataset.id;


        if (
            action ===
            "edit"
        ) {

            editStudent(
                firestoreId
            );

        }


        if (
            action ===
            "delete"
        ) {

            deleteStudent(
                firestoreId
            );

        }

    }
);


// ============================================================
// EDIT STUDENT
// ============================================================

function editStudent(
    firestoreId
) {

    const student =
        students.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!student) {

        alert(
            "Student record could not be found."
        );

        return;

    }


    openStudentModal(
        student
    );

}


// ============================================================
// DELETE STUDENT
// ============================================================

async function deleteStudent(
    firestoreId
) {

    const student =
        students.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!student) {

        alert(
            "Student record could not be found."
        );

        return;

    }


    const studentName =
        `${student.firstName || ""} ${student.lastName || ""}`
            .trim();


    const confirmed =
        confirm(
            `Are you sure you want to delete ${studentName}?\n\nThis action cannot be undone.`
        );


    if (!confirmed)
        return;


    try {

        const studentRef =
            doc(
                db,
                "students",
                firestoreId
            );


        await deleteDoc(
            studentRef
        );


        alert(
            "Student deleted successfully."
        );


        await loadStudents();

    }

    catch (error) {

        console.error(
            "Error deleting student:",
            error
        );


        alert(
            "Unable to delete student.\n\n" +
            getFirebaseErrorMessage(error)
        );

    }

}


// ============================================================
// SEARCH
// ============================================================

if (studentSearch) {

    studentSearch.addEventListener(
        "input",
        renderStudents
    );

}


// ============================================================
// CLASS FILTER
// ============================================================

if (classFilter) {

    classFilter.addEventListener(
        "change",
        renderStudents
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

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


// ============================================================
// FIREBASE ERROR MESSAGE
// ============================================================

function getFirebaseErrorMessage(
    error
) {

    if (!error)
        return "Unknown error.";


    if (
        error.code ===
        "permission-denied"
    ) {

        return (
            "Firestore permission denied. " +
            "Check your Firestore Rules and make sure " +
            "the administrator is signed in."
        );

    }


    if (
        error.code ===
        "unauthenticated"
    ) {

        return (
            "You are not authenticated. " +
            "Please log in again."
        );

    }


    if (
        error.code ===
        "failed-precondition"
    ) {

        return (
            "Firestore could not complete the operation. " +
            "Please check your Firebase configuration."
        );

    }


    if (
        error.code ===
        "unavailable"
    ) {

        return (
            "Firebase is temporarily unavailable. " +
            "Check your internet connection and try again."
        );

    }


    return (
        error.message ||
        "An unexpected Firebase error occurred."
    );

}


// ============================================================
// INITIAL LOAD
// ============================================================

loadStudents();