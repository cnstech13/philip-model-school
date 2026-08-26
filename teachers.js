/* =========================================================
   PHILIP MODEL SCHOOL
   TEACHERS MANAGEMENT
   FIRESTORE VERSION
========================================================= */

import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


/* =========================================================
   TEACHER DATABASE
========================================================= */

let teachers = [];


/* =========================================================
   ELEMENTS
========================================================= */

const teacherModal =
    document.getElementById("teacherModal");

const teacherForm =
    document.getElementById("teacherForm");

const teachersTableBody =
    document.getElementById("teachersTableBody");

const emptyTeachers =
    document.getElementById("emptyTeachers");

const teacherSearch =
    document.getElementById("teacherSearch");

const teacherStatusFilter =
    document.getElementById(
        "teacherStatusFilter"
    );

const addTeacherBtn =
    document.getElementById("addTeacherBtn");

const closeTeacherModal =
    document.getElementById(
        "closeTeacherModal"
    );

const cancelTeacherBtn =
    document.getElementById(
        "cancelTeacherBtn"
    );


/* =========================================================
   FIRESTORE COLLECTION
========================================================= */

const teachersCollection =
    collection(
        db,
        "teachers"
    );


/* =========================================================
   GENERATE TEACHER ID
========================================================= */

function generateTeacherId() {

    const year =
        new Date().getFullYear();

    let number =
        teachers.length + 1;

    let id =
        `TCH-${year}-${String(number).padStart(4, "0")}`;


    while (
        teachers.some(
            teacher =>
                teacher.id === id
        )
    ) {

        number++;

        id =
            `TCH-${year}-${String(number).padStart(4, "0")}`;

    }


    return id;

}


/* =========================================================
   LOAD TEACHERS
========================================================= */

async function loadTeachers() {

    try {

        let snapshot;


        /*
         * Try loading by createdAt.
         * If older documents do not have
         * createdAt, load normally.
         */

        try {

            const teachersQuery =
                query(
                    teachersCollection,
                    orderBy(
                        "createdAt",
                        "desc"
                    )
                );

            snapshot =
                await getDocs(
                    teachersQuery
                );

        }

        catch (orderError) {

            console.warn(
                "Ordered teacher query failed. Loading without order:",
                orderError
            );

            snapshot =
                await getDocs(
                    teachersCollection
                );

        }


        teachers = [];


        snapshot.forEach(
            documentSnapshot => {

                teachers.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        renderTeachers();

    }

    catch (error) {

        console.error(
            "Error loading teachers:",
            error
        );


        teachersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="loading"
                >
                    Unable to load teachers.
                </td>

            </tr>

        `;

        emptyTeachers.style.display =
            "none";

    }

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openTeacherModal(
    teacher = null
) {

    if (!teacherModal) {

        console.error(
            "teacherModal was not found."
        );

        return;

    }


    teacherModal.classList.add(
        "show"
    );


    if (teacher) {

        document.getElementById(
            "teacherModalTitle"
        ).textContent =
            "Edit Teacher";


        document.getElementById(
            "editingTeacherId"
        ).value =
            teacher.firestoreId;


        document.getElementById(
            "teacherFirstName"
        ).value =
            teacher.firstName || "";


        document.getElementById(
            "teacherLastName"
        ).value =
            teacher.lastName || "";


        document.getElementById(
            "teacherGender"
        ).value =
            teacher.gender || "";


        document.getElementById(
            "teacherQualification"
        ).value =
            teacher.qualification || "";


        document.getElementById(
            "teacherSpecialization"
        ).value =
            teacher.specialization || "";


        document.getElementById(
            "teacherPhone"
        ).value =
            teacher.phone || "";


        document.getElementById(
            "teacherEmail"
        ).value =
            teacher.email || "";


        document.getElementById(
            "employmentDate"
        ).value =
            teacher.employmentDate || "";


        document.getElementById(
            "teacherStatus"
        ).value =
            teacher.status || "Active";


        document.getElementById(
            "teacherAddress"
        ).value =
            teacher.address || "";

    }

    else {

        teacherForm.reset();


        document.getElementById(
            "teacherModalTitle"
        ).textContent =
            "Add Teacher";


        document.getElementById(
            "editingTeacherId"
        ).value =
            "";

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeTeacherModalFunction() {

    if (!teacherModal)
        return;


    teacherModal.classList.remove(
        "show"
    );


    teacherForm.reset();

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (addTeacherBtn) {

    addTeacherBtn.addEventListener(
        "click",
        () => {

            openTeacherModal();

        }
    );

}


if (closeTeacherModal) {

    closeTeacherModal.addEventListener(
        "click",
        closeTeacherModalFunction
    );

}


if (cancelTeacherBtn) {

    cancelTeacherBtn.addEventListener(
        "click",
        closeTeacherModalFunction
    );

}


if (teacherModal) {

    teacherModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                teacherModal
            ) {

                closeTeacherModalFunction();

            }

        }
    );

}


/* =========================================================
   SAVE TEACHER
========================================================= */

if (teacherForm) {

    teacherForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const editingFirestoreId =
                document.getElementById(
                    "editingTeacherId"
                ).value.trim();


            const firstName =
                document.getElementById(
                    "teacherFirstName"
                ).value.trim();


            const lastName =
                document.getElementById(
                    "teacherLastName"
                ).value.trim();


            const gender =
                document.getElementById(
                    "teacherGender"
                ).value;


            const qualification =
                document.getElementById(
                    "teacherQualification"
                ).value.trim();


            const specialization =
                document.getElementById(
                    "teacherSpecialization"
                ).value.trim();


            const phone =
                document.getElementById(
                    "teacherPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "teacherEmail"
                ).value.trim();


            const employmentDate =
                document.getElementById(
                    "employmentDate"
                ).value;


            const status =
                document.getElementById(
                    "teacherStatus"
                ).value;


            const address =
                document.getElementById(
                    "teacherAddress"
                ).value.trim();


            /* =================================================
               VALIDATION
            ================================================= */

            if (
                !firstName ||
                !lastName ||
                !gender ||
                !qualification ||
                !specialization ||
                !phone ||
                !employmentDate ||
                !status
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            try {

                /* =============================================
                   EDIT EXISTING TEACHER
                ============================================= */

                if (
                    editingFirestoreId
                ) {

                    const existingTeacher =
                        teachers.find(
                            teacher =>
                                teacher.firestoreId ===
                                editingFirestoreId
                        );


                    if (!existingTeacher) {

                        alert(
                            "Teacher record not found."
                        );

                        return;

                    }


                    const teacherData = {

                        id:
                            existingTeacher.id,

                        firstName,

                        lastName,

                        gender,

                        qualification,

                        specialization,

                        phone,

                        email,

                        employmentDate,

                        status,

                        address,

                        updatedAt:
                            serverTimestamp()

                    };


                    await updateDoc(

                        doc(
                            db,
                            "teachers",
                            editingFirestoreId
                        ),

                        teacherData

                    );


                    alert(
                        "Teacher updated successfully."
                    );

                }


                /* =============================================
                   ADD NEW TEACHER
                ============================================= */

                else {

                    const teacherId =
                        generateTeacherId();


                    const teacherData = {

                        id:
                            teacherId,

                        firstName,

                        lastName,

                        gender,

                        qualification,

                        specialization,

                        phone,

                        email,

                        employmentDate,

                        status,

                        address,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()

                    };


                    await setDoc(

                        doc(
                            db,
                            "teachers",
                            teacherId
                        ),

                        teacherData

                    );


                    alert(
                        "Teacher added successfully."
                    );

                }


                await loadTeachers();

                closeTeacherModalFunction();

            }

            catch (error) {

                console.error(
                    "Error saving teacher:",
                    error
                );


                alert(
                    "Unable to save teacher. Check your Firestore rules and Firebase configuration."
                );

            }

        }
    );

}


/* =========================================================
   RENDER TEACHERS
========================================================= */

function renderTeachers() {

    if (!teachersTableBody)
        return;


    const search =
        teacherSearch
            ? teacherSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        teacherStatusFilter
            ? teacherStatusFilter.value
            : "";


    const filtered =
        teachers.filter(
            teacher => {

                const fullName =
                    `${teacher.firstName || ""} ${teacher.lastName || ""}`
                        .toLowerCase();


                const email =
                    String(
                        teacher.email || ""
                    )
                    .toLowerCase();


                const teacherId =
                    String(
                        teacher.id || ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    fullName.includes(
                        search
                    ) ||
                    teacherId.includes(
                        search
                    ) ||
                    email.includes(
                        search
                    );


                const matchesStatus =
                    !selectedStatus ||
                    teacher.status ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    teachersTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        if (emptyTeachers) {

            emptyTeachers.style.display =
                "block";

        }

        return;

    }


    if (emptyTeachers) {

        emptyTeachers.style.display =
            "none";

    }


    filtered.forEach(
        teacher => {

            const row =
                document.createElement(
                    "tr"
                );


            const firstInitial =
                teacher.firstName
                    ? teacher.firstName[0]
                    : "";


            const lastInitial =
                teacher.lastName
                    ? teacher.lastName[0]
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
                            teacher.id
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
                                teacher.firstName || ""
                            )}

                            ${escapeHTML(
                                teacher.lastName || ""
                            )}

                        </strong>

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                        teacher.gender || "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        teacher.qualification || "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        teacher.phone || "-"
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${
                            teacher.status ===
                            "Active"

                                ? "status-active"

                                : "status-inactive"
                        }
                    ">

                        ${escapeHTML(
                            teacher.status || "-"
                        )}

                    </span>

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="table-action"
                            title="Edit"
                            data-edit-teacher="${escapeHTML(
                                teacher.firestoreId
                            )}"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="table-action"
                            title="Delete"
                            data-delete-teacher="${escapeHTML(
                                teacher.firestoreId
                            )}"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            /* =============================================
               EDIT BUTTON
            ============================================= */

            const editButton =
                row.querySelector(
                    "[data-edit-teacher]"
                );


            editButton.addEventListener(
                "click",
                () => {

                    editTeacher(
                        teacher.firestoreId
                    );

                }
            );


            /* =============================================
               DELETE BUTTON
            ============================================= */

            const deleteButton =
                row.querySelector(
                    "[data-delete-teacher]"
                );


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteTeacher(
                        teacher.firestoreId
                    );

                }
            );


            teachersTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   EDIT TEACHER
========================================================= */

function editTeacher(
    firestoreId
) {

    const teacher =
        teachers.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!teacher) {

        alert(
            "Teacher record not found."
        );

        return;

    }


    openTeacherModal(
        teacher
    );

}


/* =========================================================
   DELETE TEACHER
========================================================= */

async function deleteTeacher(
    firestoreId
) {

    const teacher =
        teachers.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!teacher)
        return;


    const confirmed =
        confirm(
            `Delete ${teacher.firstName} ${teacher.lastName}?\n\nThis action cannot be undone.`
        );


    if (!confirmed)
        return;


    try {

        await deleteDoc(

            doc(
                db,
                "teachers",
                firestoreId
            )

        );


        alert(
            "Teacher deleted successfully."
        );


        await loadTeachers();

    }

    catch (error) {

        console.error(
            "Error deleting teacher:",
            error
        );


        alert(
            "Unable to delete teacher. Please try again."
        );

    }

}


/* =========================================================
   SEARCH / FILTER
========================================================= */

if (teacherSearch) {

    teacherSearch.addEventListener(
        "input",
        renderTeachers
    );

}


if (teacherStatusFilter) {

    teacherStatusFilter.addEventListener(
        "change",
        renderTeachers
    );

}


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
   INITIAL LOAD
========================================================= */

loadTeachers();