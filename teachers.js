// ======================================================
// TEACHERS.JS
// Philip Model School
// Firebase Firestore Version
// ======================================================

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


// ======================================================
// DATA
// ======================================================

let teachers = [];


// ======================================================
// ELEMENTS
// ======================================================

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
    document.getElementById("teacherStatusFilter");

const addTeacherBtn =
    document.getElementById("addTeacherBtn");

const closeTeacherModal =
    document.getElementById("closeTeacherModal");

const cancelTeacherBtn =
    document.getElementById("cancelTeacherBtn");


// ======================================================
// FIRESTORE COLLECTION
// ======================================================

const teachersCollection =
    collection(db, "teachers");


// ======================================================
// GENERATE TEACHER ID
// ======================================================

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


// ======================================================
// LOAD TEACHERS
// ======================================================

async function loadTeachers() {

    try {

        const teacherQuery =
            query(
                teachersCollection,
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                teacherQuery
            );


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


        /*
         * If the collection is empty or
         * createdAt is not available,
         * try loading without orderBy.
         */

        try {

            const snapshot =
                await getDocs(
                    teachersCollection
                );


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

        catch (secondError) {

            console.error(
                "Firestore loading error:",
                secondError
            );


            alert(
                "Unable to load teachers from Firestore."
            );

        }

    }

}


// ======================================================
// OPEN TEACHER MODAL
// ======================================================

function openTeacherModal(
    teacher = null
) {

    if (!teacherModal)
        return;


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

        document.getElementById(
            "teacherStatus"
        ).value =
            "Active";

    }

}


// ======================================================
// CLOSE MODAL
// ======================================================

function closeTeacherModalFunction() {

    teacherModal.classList.remove(
        "show"
    );

    teacherForm.reset();

}


// ======================================================
// MODAL EVENTS
// ======================================================

addTeacherBtn.addEventListener(
    "click",
    () => {

        openTeacherModal();

    }
);


closeTeacherModal.addEventListener(
    "click",
    closeTeacherModalFunction
);


cancelTeacherBtn.addEventListener(
    "click",
    closeTeacherModalFunction
);


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


// ======================================================
// SAVE TEACHER
// ======================================================

teacherForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const saveButton =
            teacherForm.querySelector(
                'button[type="submit"]'
            );


        const originalText =
            saveButton
                ? saveButton.textContent
                : "";


        try {

            if (saveButton) {

                saveButton.disabled =
                    true;

                saveButton.textContent =
                    "Saving...";

            }


            const editingId =
                document.getElementById(
                    "editingTeacherId"
                ).value;


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


            // ==========================================
            // VALIDATION
            // ==========================================

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


            // ==========================================
            // TEACHER DATA
            // ==========================================

            const teacherData = {

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


            // ==========================================
            // EDIT
            // ==========================================

            if (editingId) {

                const teacherRef =
                    doc(
                        db,
                        "teachers",
                        editingId
                    );


                await updateDoc(
                    teacherRef,
                    teacherData
                );


                alert(
                    "Teacher updated successfully."
                );

            }


            // ==========================================
            // ADD
            // ==========================================

            else {

                const teacherId =
                    generateTeacherId();


                const newTeacher = {

                    id:
                        teacherId,

                    ...teacherData,

                    createdAt:
                        serverTimestamp()

                };


                await addDoc(
                    teachersCollection,
                    newTeacher
                );


                alert(
                    "Teacher added successfully."
                );

            }


            // ==========================================
            // REFRESH
            // ==========================================

            await loadTeachers();

            closeTeacherModalFunction();

        }

        catch (error) {

            console.error(
                "Teacher save error:",
                error
            );


            console.error(
                "Error code:",
                error.code
            );


            console.error(
                "Error message:",
                error.message
            );


            if (
                error.code ===
                "permission-denied"
            ) {

                alert(
                    "Firestore permission denied.\n\n" +
                    "Open Firebase Console → Firestore Database → Rules " +
                    "and check your security rules."
                );

            }

            else {

                alert(
                    "Unable to save teacher.\n\n" +
                    error.message
                );

            }

        }

        finally {

            if (saveButton) {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    originalText ||
                    "Save Teacher";

            }

        }

    }
);


// ======================================================
// RENDER TEACHERS
// ======================================================

function renderTeachers() {

    if (!teachersTableBody)
        return;


    const search =
        teacherSearch.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        teacherStatusFilter.value;


    const filtered =
        teachers.filter(
            teacher => {

                const fullName =
                    `${teacher.firstName || ""} ${teacher.lastName || ""}`
                        .toLowerCase();


                const teacherId =
                    String(
                        teacher.id || ""
                    ).toLowerCase();


                const email =
                    String(
                        teacher.email || ""
                    ).toLowerCase();


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

        emptyTeachers.style.display =
            "block";

        return;

    }


    emptyTeachers.style.display =
        "none";


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
                        teacher.gender || ""
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        teacher.qualification || ""
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        teacher.phone || ""
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
                            teacher.status || ""
                        )}

                    </span>

                </td>

                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="Edit"
                            data-edit="${escapeHTML(
                                teacher.firestoreId
                            )}"
                        >
                            ✏️
                        </button>

                        <button
                            class="table-action"
                            title="Delete"
                            data-delete="${escapeHTML(
                                teacher.firestoreId
                            )}"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            teachersTableBody.appendChild(
                row
            );

        }
    );


    // ==========================================
    // ACTION BUTTONS
    // ==========================================

    teachersTableBody
        .querySelectorAll(
            "[data-edit]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.edit;


                        const teacher =
                            teachers.find(
                                item =>
                                    item.firestoreId ===
                                    id
                            );


                        if (teacher) {

                            openTeacherModal(
                                teacher
                            );

                        }

                    }
                );

            }
        );


    teachersTableBody
        .querySelectorAll(
            "[data-delete]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteTeacher(
                            button.dataset.delete
                        );

                    }
                );

            }
        );

}


// ======================================================
// DELETE TEACHER
// ======================================================

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
            `Delete ${teacher.firstName} ${teacher.lastName}?`
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
            "Delete teacher error:",
            error
        );


        alert(
            "Unable to delete teacher.\n\n" +
            error.message
        );

    }

}


// ======================================================
// SEARCH
// ======================================================

teacherSearch.addEventListener(
    "input",
    renderTeachers
);


// ======================================================
// STATUS FILTER
// ======================================================

teacherStatusFilter.addEventListener(
    "change",
    renderTeachers
);


// ======================================================
// ESCAPE HTML
// ======================================================

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


// ======================================================
// INITIALIZE
// ======================================================

loadTeachers();