/* =========================================================
   PHILIP MODEL SCHOOL
   STUDENTS MANAGEMENT
   FIRESTORE VERSION
========================================================= */

import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


/* =========================================================
   STUDENT DATABASE
========================================================= */

let students = [];


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   CHECK REQUIRED ELEMENTS
========================================================= */

if (
    !studentModal ||
    !studentForm ||
    !studentsTableBody ||
    !emptyStudents ||
    !studentSearch ||
    !classFilter ||
    !addStudentBtn ||
    !closeStudentModal ||
    !cancelStudentBtn
) {

    console.error(
        "Students page: One or more required HTML elements are missing."
    );

}


/* =========================================================
   FIRESTORE COLLECTION
========================================================= */

const studentsCollection =
    collection(
        db,
        "students"
    );


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                studentsCollection
            );


        students = [];


        snapshot.forEach(
            documentSnapshot => {

                students.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        renderStudents();

    }

    catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        alert(
            "Unable to load students from Firebase.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   GENERATE STUDENT ID
========================================================= */

function generateStudentId() {

    const year =
        new Date().getFullYear();


    let number =
        students.length + 1;


    let studentId =
        `PMS-${year}-${String(number).padStart(4, "0")}`;


    while (
        students.some(
            student =>
                student.id === studentId
        )
    ) {

        number++;


        studentId =
            `PMS-${year}-${String(number).padStart(4, "0")}`;

    }


    return studentId;

}


/* =========================================================
   OPEN STUDENT MODAL
========================================================= */

function openStudentModal(
    student = null
) {

    if (!studentModal)
        return;


    studentModal.classList.add(
        "show"
    );


    if (student) {

        /* =========================
           EDIT MODE
        ========================= */

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
            student.class || "";


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

        /* =========================
           ADD MODE
        ========================= */

        studentForm.reset();


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Add Student";


        document.getElementById(
            "editingStudentId"
        ).value =
            "";

    }

}


/* =========================================================
   CLOSE STUDENT MODAL
========================================================= */

function closeModal() {

    if (!studentModal)
        return;


    studentModal.classList.remove(
        "show"
    );


    if (studentForm) {

        studentForm.reset();

    }


    document.getElementById(
        "editingStudentId"
    ).value = "";

}


/* =========================================================
   OPEN ADD STUDENT MODAL
========================================================= */

addStudentBtn.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        openStudentModal();

    }
);


/* =========================================================
   CLOSE BUTTON
========================================================= */

closeStudentModal.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        closeModal();

    }
);


/* =========================================================
   CANCEL BUTTON
========================================================= */

cancelStudentBtn.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        closeModal();

    }
);


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

studentModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            studentModal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   SAVE STUDENT
========================================================= */

studentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        /* =========================
           GET EDITING ID
        ========================= */

        const editingFirestoreId =
            document.getElementById(
                "editingStudentId"
            ).value.trim();


        /* =========================
           GET FORM VALUES
        ========================= */

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


        /* =========================
           VALIDATION
        ========================= */

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

            alert(
                "Please complete all required fields."
            );

            return;

        }


        /* =========================
           PREVENT DOUBLE SUBMISSION
        ========================= */

        const saveButton =
            studentForm.querySelector(
                'button[type="submit"]'
            );


        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";

        }


        try {

            /* =================================================
               EDIT EXISTING STUDENT
            ================================================= */

            if (editingFirestoreId) {

                const existingStudent =
                    students.find(
                        student =>
                            student.firestoreId ===
                            editingFirestoreId
                    );


                if (!existingStudent) {

                    throw new Error(
                        "The student record could not be found."
                    );

                }


                const studentData = {

                    id:
                        existingStudent.id,

                    firstName,

                    lastName,

                    dateOfBirth,

                    gender,

                    class:
                        studentClass,

                    admissionDate,

                    parentName,

                    parentPhone,

                    parentEmail,

                    status,

                    address,

                    updatedAt:
                        new Date().toISOString()

                };


                await setDoc(

                    doc(
                        db,
                        "students",
                        editingFirestoreId
                    ),

                    studentData,

                    {
                        merge: true
                    }

                );


                alert(
                    "Student updated successfully."
                );

            }


            /* =================================================
               ADD NEW STUDENT
            ================================================= */

            else {

                const studentId =
                    generateStudentId();


                const newStudent = {

                    id:
                        studentId,

                    firstName,

                    lastName,

                    dateOfBirth,

                    gender,

                    class:
                        studentClass,

                    admissionDate,

                    parentName,

                    parentPhone,

                    parentEmail,

                    status,

                    address,

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()

                };


                await setDoc(

                    doc(
                        db,
                        "students",
                        studentId
                    ),

                    newStudent

                );


                alert(
                    "Student added successfully."
                );

            }


            /* =========================
               RELOAD STUDENTS
            ========================= */

            await loadStudents();


            /* =========================
               CLOSE MODAL
            ========================= */

            closeModal();

        }

        catch (error) {

            console.error(
                "Error saving student:",
                error
            );


            alert(
                "Unable to save student.\n\n" +
                error.message
            );

        }

        finally {

            if (saveButton) {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "Save Student";

            }

        }

    }
);


/* =========================================================
   RENDER STUDENTS
========================================================= */

function renderStudents() {

    const search =
        studentSearch.value
            .trim()
            .toLowerCase();


    const selectedClass =
        classFilter.value;


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
                    student.class ===
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
                (
                    student.firstName ||
                    ""
                )[0] || "";


            const lastInitial =
                (
                    student.lastName ||
                    ""
                )[0] || "";


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


                        <div>

                            <strong>

                                ${escapeHTML(
                                    student.firstName
                                )}

                                ${escapeHTML(
                                    student.lastName
                                )}

                            </strong>

                        </div>

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                        student.gender
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        student.class
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        student.parentPhone
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${
                            student.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                        }
                    ">

                        ${escapeHTML(
                            student.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="table-actions">


                        <button
                            type="button"
                            class="table-action"
                            title="Edit"
                            onclick="editStudent('${escapeAttribute(student.firestoreId)}')"
                        >

                            ✏️

                        </button>


                        <button
                            type="button"
                            class="table-action"
                            title="Delete"
                            onclick="deleteStudent('${escapeAttribute(student.firestoreId)}')"
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


/* =========================================================
   EDIT STUDENT
========================================================= */

window.editStudent =
    function(firestoreId) {

        const student =
            students.find(
                item =>
                    item.firestoreId ===
                    firestoreId
            );


        if (!student) {

            alert(
                "Student record not found."
            );

            return;

        }


        openStudentModal(
            student
        );

    };


/* =========================================================
   DELETE STUDENT
========================================================= */

window.deleteStudent =
    async function(firestoreId) {

        const student =
            students.find(
                item =>
                    item.firestoreId ===
                    firestoreId
            );


        if (!student) {

            alert(
                "Student record not found."
            );

            return;

        }


        const confirmed =
            confirm(
                `Delete ${student.firstName} ${student.lastName}?\n\n` +
                "This action cannot be undone."
            );


        if (!confirmed)
            return;


        try {

            await deleteDoc(

                doc(
                    db,
                    "students",
                    firestoreId
                )

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
                error.message
            );

        }

    };


/* =========================================================
   SEARCH
========================================================= */

studentSearch.addEventListener(
    "input",
    renderStudents
);


/* =========================================================
   CLASS FILTER
========================================================= */

classFilter.addEventListener(
    "change",
    renderStudents
);


/* =========================================================
   ESCAPE HTML
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
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return String(
        value ?? ""
    )

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadStudents();