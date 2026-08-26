/* =========================
   FIREBASE SUBJECT DATABASE
========================= */

import {
    collection,
    getDocs,
    doc,
    addDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";
let subjects = [];


/* =========================
   ELEMENTS
========================= */

const subjectModal =
    document.getElementById("subjectModal");

const subjectForm =
    document.getElementById("subjectForm");

const subjectsTableBody =
    document.getElementById(
        "subjectsTableBody"
    );

const emptySubjects =
    document.getElementById(
        "emptySubjects"
    );

const subjectSearch =
    document.getElementById(
        "subjectSearch"
    );

const subjectLevelFilter =
    document.getElementById(
        "subjectLevelFilter"
    );

const subjectStatusFilter =
    document.getElementById(
        "subjectStatusFilter"
    );

const addSubjectBtn =
    document.getElementById(
        "addSubjectBtn"
    );

const closeSubjectModal =
    document.getElementById(
        "closeSubjectModal"
    );

const cancelSubjectBtn =
    document.getElementById(
        "cancelSubjectBtn"
    );


/* =========================
   FIRESTORE COLLECTION
========================= */

const subjectsCollection =
    collection(db, "subjects");


/* =========================
   LOAD SUBJECTS
========================= */

async function loadSubjects() {

    try {

        const snapshot =
            await getDocs(
                subjectsCollection
            );

        subjects = [];

        snapshot.forEach(
            documentSnapshot => {

                subjects.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );

        renderSubjects();

    }

    catch (error) {

        console.error(
            "Error loading subjects:",
            error
        );

        alert(
            "Unable to load subjects from Firestore."
        );

    }

}


/* =========================
   GENERATE SUBJECT ID
========================= */

function generateSubjectId() {

    let number =
        subjects.length + 1;

    let id =
        `SUB-${String(number).padStart(3, "0")}`;


    while (
        subjects.some(
            subject =>
                subject.id === id
        )
    ) {

        number++;

        id =
            `SUB-${String(number).padStart(3, "0")}`;

    }


    return id;

}


/* =========================
   OPEN MODAL
========================= */

function openSubjectModal(
    subject = null
) {

    subjectModal.classList.add(
        "show"
    );


    if (subject) {

        document.getElementById(
            "subjectModalTitle"
        ).textContent =
            "Edit Subject";


        document.getElementById(
            "editingSubjectId"
        ).value =
            subject.firestoreId;


        document.getElementById(
            "subjectName"
        ).value =
            subject.name || "";


        document.getElementById(
            "subjectCode"
        ).value =
            subject.code || "";


        document.getElementById(
            "subjectLevel"
        ).value =
            subject.level || "";


        document.getElementById(
            "subjectType"
        ).value =
            subject.type || "";


        document.getElementById(
            "subjectStatus"
        ).value =
            subject.status || "";


        document.getElementById(
            "subjectDescription"
        ).value =
            subject.description || "";

    }

    else {

        subjectForm.reset();


        document.getElementById(
            "subjectModalTitle"
        ).textContent =
            "Add Subject";


        document.getElementById(
            "editingSubjectId"
        ).value =
            "";

    }

}


/* =========================
   CLOSE MODAL
========================= */

function closeSubjectModalFunction() {

    subjectModal.classList.remove(
        "show"
    );

    subjectForm.reset();

}


addSubjectBtn.addEventListener(
    "click",
    () => openSubjectModal()
);


closeSubjectModal.addEventListener(
    "click",
    closeSubjectModalFunction
);


cancelSubjectBtn.addEventListener(
    "click",
    closeSubjectModalFunction
);


subjectModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            subjectModal
        ) {

            closeSubjectModalFunction();

        }

    }
);


/* =========================
   SAVE SUBJECT
========================= */

subjectForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const editingId =
            document.getElementById(
                "editingSubjectId"
            ).value;


        const name =
            document.getElementById(
                "subjectName"
            ).value.trim();


        const code =
            document.getElementById(
                "subjectCode"
            ).value
                .trim()
                .toUpperCase();


        const level =
            document.getElementById(
                "subjectLevel"
            ).value;


        const type =
            document.getElementById(
                "subjectType"
            ).value;


        const status =
            document.getElementById(
                "subjectStatus"
            ).value;


        const description =
            document.getElementById(
                "subjectDescription"
            ).value.trim();


        /* =========================
           VALIDATION
        ========================= */

        if (
            !name ||
            !code ||
            !level ||
            !type ||
            !status
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }


        /* =========================
           DUPLICATE NAME
        ========================= */

        const duplicateName =
            subjects.some(
                subject =>

                    subject.name
                        ?.toLowerCase() ===
                    name.toLowerCase() &&

                    subject.firestoreId !==
                    editingId

            );


        if (duplicateName) {

            alert(
                "A subject with this name already exists."
            );

            return;

        }


        /* =========================
           DUPLICATE CODE
        ========================= */

        const duplicateCode =
            subjects.some(
                subject =>

                    subject.code
                        ?.toLowerCase() ===
                    code.toLowerCase() &&

                    subject.firestoreId !==
                    editingId

            );


        if (duplicateCode) {

            alert(
                "A subject with this code already exists."
            );

            return;

        }


        const subjectData = {

            id:
                editingId
                    ? (
                        subjects.find(
                            subject =>
                                subject.firestoreId ===
                                editingId
                        )?.id ||
                        generateSubjectId()
                    )
                    : generateSubjectId(),

            name,

            code,

            level,

            type,

            status,

            description,

            updatedAt:
                new Date().toISOString()

        };


        try {

            /* =========================
               EDIT
            ========================= */

            if (editingId) {

                const subjectRef =
                    doc(
                        db,
                        "subjects",
                        editingId
                    );


                await updateDoc(
                    subjectRef,
                    subjectData
                );

            }

            /* =========================
               ADD
            ========================= */

            else {

                subjectData.createdAt =
                    new Date().toISOString();


                await addDoc(
                    subjectsCollection,
                    subjectData
                );

            }


            alert(
                editingId
                    ? "Subject updated successfully."
                    : "Subject added successfully."
            );


            await loadSubjects();

            closeSubjectModalFunction();

        }

        catch (error) {

            console.error(
                "Error saving subject:",
                error
            );

            alert(
                "Unable to save subject. Please try again."
            );

        }

    }
);


/* =========================
   RENDER SUBJECTS
========================= */

function renderSubjects() {

    const search =
        subjectSearch.value
            .trim()
            .toLowerCase();


    const selectedLevel =
        subjectLevelFilter.value;


    const selectedStatus =
        subjectStatusFilter.value;


    const filtered =
        subjects.filter(
            subject => {

                const matchesSearch =
                    !search ||

                    subject.name
                        ?.toLowerCase()
                        .includes(search) ||

                    subject.code
                        ?.toLowerCase()
                        .includes(search) ||

                    subject.id
                        ?.toLowerCase()
                        .includes(search);


                const matchesLevel =
                    !selectedLevel ||

                    subject.level ===
                    selectedLevel;


                const matchesStatus =
                    !selectedStatus ||

                    subject.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesLevel &&
                    matchesStatus
                );

            }
        );


    subjectsTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        emptySubjects.style.display =
            "block";

        return;

    }


    emptySubjects.style.display =
        "none";


    filtered.forEach(
        subject => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <span class="student-id">

                        ${escapeHTML(
                            subject.id
                        )}

                    </span>

                </td>


                <td>

                    <strong>

                        ${escapeHTML(
                            subject.name
                        )}

                    </strong>

                </td>


                <td>

                    <span class="student-id">

                        ${escapeHTML(
                            subject.code
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHTML(
                        subject.level
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        subject.type
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${
                            subject.status ===
                            "Active"

                                ? "status-active"

                                : "status-inactive"
                        }
                    ">

                        ${escapeHTML(
                            subject.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="Edit"
                            onclick="editSubject('${subject.firestoreId}')"
                        >
                            ✏️
                        </button>


                        <button
                            class="table-action"
                            title="Delete"
                            onclick="deleteSubject('${subject.firestoreId}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            subjectsTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================
   EDIT SUBJECT
========================= */

function editSubject(
    firestoreId
) {

    const subject =
        subjects.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (subject) {

        openSubjectModal(
            subject
        );

    }

}


/* =========================
   DELETE SUBJECT
========================= */

async function deleteSubject(
    firestoreId
) {

    const subject =
        subjects.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!subject)
        return;


    const confirmed =
        confirm(
            `Delete ${subject.name}?`
        );


    if (!confirmed)
        return;


    try {

        await deleteDoc(
            doc(
                db,
                "subjects",
                firestoreId
            )
        );


        await loadSubjects();

    }

    catch (error) {

        console.error(
            "Error deleting subject:",
            error
        );

        alert(
            "Unable to delete subject."
        );

    }

}


/* =========================
   FILTERS
========================= */

subjectSearch.addEventListener(
    "input",
    renderSubjects
);


subjectLevelFilter.addEventListener(
    "change",
    renderSubjects
);


subjectStatusFilter.addEventListener(
    "change",
    renderSubjects
);


/* =========================
   ESCAPE HTML
========================= */

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


/* =========================
   INITIAL LOAD
========================= */

loadSubjects();