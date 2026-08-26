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
   LOAD STUDENTS FROM FIRESTORE
========================================================= */

async function loadStudents() {

    try {

        students = [];

        const studentsRef =
            collection(
                db,
                "students"
            );

        const snapshot =
            await getDocs(
                studentsRef
            );


        snapshot.forEach(
            documentSnapshot => {

                students.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        renderStudents();


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        alert(
            "Unable to load students from Firebase."
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


    let id =
        `BFA-${year}-${String(number).padStart(4, "0")}`;


    while (
        students.some(
            student =>
                student.id === id
        )
    ) {

        number++;


        id =
            `BFA-${year}-${String(number).padStart(4, "0")}`;

    }


    return id;

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openStudentModal(
    student = null
) {

    studentModal.classList.add(
        "show"
    );


    if (student) {

        document.getElementById(
            "modalTitle"
        ).textContent =
            "Edit Student";


        document.getElementById(
            "editingStudentId"
        ).value =
            student.id;


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
   CLOSE MODAL
========================================================= */

function closeModal() {

    studentModal.classList.remove(
        "show"
    );

    studentForm.reset();

}


addStudentBtn.addEventListener(
    "click",
    () => openStudentModal()
);


closeStudentModal.addEventListener(
    "click",
    closeModal
);


cancelStudentBtn.addEventListener(
    "click",
    closeModal
);


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE
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


        const editingId =
            document.getElementById(
                "editingStudentId"
            ).value;


        const studentData = {

            firstName:
                document.getElementById(
                    "firstName"
                ).value.trim(),

            lastName:
                document.getElementById(
                    "lastName"
                ).value.trim(),

            dateOfBirth:
                document.getElementById(
                    "dateOfBirth"
                ).value,

            gender:
                document.getElementById(
                    "gender"
                ).value,

            class:
                document.getElementById(
                    "studentClass"
                ).value,

            admissionDate:
                document.getElementById(
                    "admissionDate"
                ).value,

            parentName:
                document.getElementById(
                    "parentName"
                ).value.trim(),

            parentPhone:
                document.getElementById(
                    "parentPhone"
                ).value.trim(),

            parentEmail:
                document.getElementById(
                    "parentEmail"
                ).value.trim(),

            status:
                document.getElementById(
                    "studentStatus"
                ).value,

            address:
                document.getElementById(
                    "studentAddress"
                ).value.trim(),

            updatedAt:
                new Date().toISOString()

        };


        /* =================================================
           VALIDATION
        ================================================= */

        if (
            !studentData.firstName ||
            !studentData.lastName ||
            !studentData.class
        ) {

            alert(
                "Please enter the student's first name, last name and class."
            );

            return;

        }


        try {

            /* =============================================
               EDIT EXISTING STUDENT
            ============================================= */

            if (editingId) {

                await setDoc(

                    doc(
                        db,
                        "students",
                        editingId
                    ),

                    {

                        ...studentData,

                        id:
                            editingId

                    },

                    {
                        merge: true
                    }

                );


                alert(
                    "Student updated successfully."
                );

            }


            /* =============================================
               ADD NEW STUDENT
            ============================================= */

            else {

                const studentId =
                    generateStudentId();


                await setDoc(

                    doc(
                        db,
                        "students",
                        studentId
                    ),

                    {

                        id:
                            studentId,

                        ...studentData,

                        createdAt:
                            new Date().toISOString()

                    }

                );


                alert(
                    "Student added successfully."
                );

            }


            await loadStudents();

            closeModal();


        } catch (error) {

            console.error(
                "Error saving student:",
                error
            );


            alert(
                "Unable to save student. Check your Firestore rules and Firebase configuration."
            );

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
                    )
                    .toLowerCase();


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
                        ${escapeHTML(student.id)}
                    </span>

                </td>


                <td>

                    <div class="student-name">

                        <div class="student-avatar">
                            ${escapeHTML(initials)}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(student.firstName)}
                                ${escapeHTML(student.lastName)}
                            </strong>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(student.gender)}
                </td>


                <td>
                    ${escapeHTML(student.class)}
                </td>


                <td>
                    ${escapeHTML(student.parentPhone)}
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

                        ${escapeHTML(student.status)}

                    </span>

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="Edit"
                            onclick="editStudent('${escapeAttribute(student.id)}')"
                        >
                            ✏️
                        </button>


                        <button
                            class="table-action"
                            title="Delete"
                            onclick="deleteStudent('${escapeAttribute(student.id)}')"
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
    function(id) {

        const student =
            students.find(
                student =>
                    student.id === id
            );


        if (student) {

            openStudentModal(
                student
            );

        }

    };


/* =========================================================
   DELETE STUDENT
========================================================= */

window.deleteStudent =
    async function(id) {

        const student =
            students.find(
                student =>
                    student.id === id
            );


        if (!student)
            return;


        const confirmed =
            confirm(
                `Delete ${student.firstName} ${student.lastName}?\n\nThis action cannot be undone.`
            );


        if (!confirmed)
            return;


        try {

            await deleteDoc(

                doc(
                    db,
                    "students",
                    id
                )

            );


            alert(
                "Student deleted successfully."
            );


            await loadStudents();


        } catch (error) {

            console.error(
                "Error deleting student:",
                error
            );


            alert(
                "Unable to delete student from Firebase."
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


classFilter.addEventListener(
    "change",
    renderStudents
);


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(
    value
) {

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
   ATTRIBUTE ESCAPE
========================================================= */

function escapeAttribute(
    value
) {

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