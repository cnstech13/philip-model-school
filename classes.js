/* =========================================================
   PHILIP MODEL SCHOOL
   CLASS MANAGEMENT
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
   DATA
========================================================= */

let classes = [];
let teachers = [];


/* =========================================================
   ELEMENTS
========================================================= */

const classModal =
    document.getElementById("classModal");

const classForm =
    document.getElementById("classForm");

const classesTableBody =
    document.getElementById("classesTableBody");

const emptyClasses =
    document.getElementById("emptyClasses");

const classSearch =
    document.getElementById("classSearch");

const sectionFilter =
    document.getElementById("sectionFilter");

const addClassBtn =
    document.getElementById("addClassBtn");

const closeClassModal =
    document.getElementById("closeClassModal");

const cancelClassBtn =
    document.getElementById("cancelClassBtn");

const classTeacher =
    document.getElementById("classTeacher");


/* =========================================================
   FIRESTORE COLLECTIONS
========================================================= */

const classesCollection =
    collection(db, "classes");

const teachersCollection =
    collection(db, "teachers");


/* =========================================================
   GENERATE CLASS ID
========================================================= */

function generateClassId() {

    let number =
        classes.length + 1;

    let id =
        `CLS-${String(number).padStart(3, "0")}`;


    while (
        classes.some(
            item =>
                item.id === id
        )
    ) {

        number++;

        id =
            `CLS-${String(number).padStart(3, "0")}`;

    }


    return id;
}


/* =========================================================
   LOAD TEACHERS
========================================================= */

async function loadTeachers() {

    try {

        const snapshot =
            await getDocs(
                teachersCollection
            );


        teachers = [];


        snapshot.forEach(
            teacherDocument => {

                teachers.push({

                    firestoreId:
                        teacherDocument.id,

                    ...teacherDocument.data()

                });

            }
        );


        populateTeacherDropdown();

    }

    catch (error) {

        console.error(
            "Error loading teachers:",
            error
        );

    }

}


/* =========================================================
   POPULATE TEACHER DROPDOWN
========================================================= */

function populateTeacherDropdown() {

    if (!classTeacher)
        return;


    classTeacher.innerHTML = `

        <option value="">
            No Class Teacher
        </option>

    `;


    teachers.forEach(
        teacher => {

            const fullName =
                `${teacher.firstName || ""} ${teacher.lastName || ""}`
                    .trim();


            if (!fullName)
                return;


            const option =
                document.createElement("option");


            option.value =
                teacher.id ||
                teacher.firestoreId;


            option.textContent =
                fullName;


            classTeacher.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   LOAD CLASSES
========================================================= */

async function loadClasses() {

    try {

        const snapshot =
            await getDocs(
                classesCollection
            );


        classes = [];


        snapshot.forEach(
            classDocument => {

                classes.push({

                    firestoreId:
                        classDocument.id,

                    ...classDocument.data()

                });

            }
        );


        renderClasses();

    }

    catch (error) {

        console.error(
            "Error loading classes:",
            error
        );


        alert(
            "Unable to load classes from Firestore."
        );

    }

}


/* =========================================================
   OPEN CLASS MODAL
========================================================= */

function openClassModal(
    classData = null
) {

    classModal.classList.add(
        "show"
    );


    if (classData) {

        document.getElementById(
            "classModalTitle"
        ).textContent =
            "Edit Class";


        document.getElementById(
            "editingClassId"
        ).value =
            classData.firestoreId;


        document.getElementById(
            "className"
        ).value =
            classData.name || "";


        document.getElementById(
            "classSection"
        ).value =
            classData.section || "";


        document.getElementById(
            "classTeacher"
        ).value =
            classData.teacherId || "";


        document.getElementById(
            "academicSession"
        ).value =
            classData.academicSession ||
            "2026/2027";


        document.getElementById(
            "maxStudents"
        ).value =
            classData.maxStudents || 40;


        document.getElementById(
            "classStatus"
        ).value =
            classData.status || "Active";

    }

    else {

        classForm.reset();


        document.getElementById(
            "classModalTitle"
        ).textContent =
            "Add Class";


        document.getElementById(
            "editingClassId"
        ).value =
            "";


        document.getElementById(
            "academicSession"
        ).value =
            "2026/2027";


        document.getElementById(
            "maxStudents"
        ).value =
            40;


        document.getElementById(
            "classStatus"
        ).value =
            "Active";


        document.getElementById(
            "classTeacher"
        ).value =
            "";

    }

}


/* =========================================================
   CLOSE CLASS MODAL
========================================================= */

function closeClassModalFunction() {

    classModal.classList.remove(
        "show"
    );


    classForm.reset();


    document.getElementById(
        "academicSession"
    ).value =
        "2026/2027";


    document.getElementById(
        "maxStudents"
    ).value =
        40;


    document.getElementById(
        "classStatus"
    ).value =
        "Active";

}


/* =========================================================
   OPEN MODAL BUTTON
========================================================= */

if (addClassBtn) {

    addClassBtn.addEventListener(
        "click",
        function() {

            openClassModal();

        }
    );

}


/* =========================================================
   CLOSE BUTTONS
========================================================= */

if (closeClassModal) {

    closeClassModal.addEventListener(
        "click",
        closeClassModalFunction
    );

}


if (cancelClassBtn) {

    cancelClassBtn.addEventListener(
        "click",
        closeClassModalFunction
    );

}


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE
========================================================= */

if (classModal) {

    classModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                classModal
            ) {

                closeClassModalFunction();

            }

        }
    );

}


/* =========================================================
   SAVE CLASS
========================================================= */

if (classForm) {

    classForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const editingId =
                document.getElementById(
                    "editingClassId"
                ).value;


            const className =
                document.getElementById(
                    "className"
                ).value.trim();


            const section =
                document.getElementById(
                    "classSection"
                ).value;


            const teacherId =
                document.getElementById(
                    "classTeacher"
                ).value;


            const academicSession =
                document.getElementById(
                    "academicSession"
                ).value.trim();


            const maxStudents =
                Number(
                    document.getElementById(
                        "maxStudents"
                    ).value
                );


            const status =
                document.getElementById(
                    "classStatus"
                ).value;


            /* =============================================
               VALIDATION
            ============================================= */

            if (
                !className ||
                !section ||
                !academicSession ||
                !maxStudents
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            /* =============================================
               DUPLICATE CLASS CHECK
            ============================================= */

            const duplicate =
                classes.some(
                    item =>

                        item.name
                            ?.toLowerCase() ===
                        className.toLowerCase() &&

                        item.academicSession ===
                        academicSession &&

                        item.firestoreId !==
                        editingId

                );


            if (duplicate) {

                alert(
                    "This class already exists for the selected academic session."
                );

                return;

            }


            /* =============================================
               FIND TEACHER NAME
            ============================================= */

            const teacher =
                teachers.find(
                    item =>

                        (
                            item.id ||
                            item.firestoreId
                        ) ===
                        teacherId

                );


            const teacherName =
                teacher
                    ? `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim()
                    : "No Class Teacher";


            /* =============================================
               CLASS DATA
            ============================================= */

            const classData = {

                id:
                    editingId
                        ? (
                            classes.find(
                                item =>
                                    item.firestoreId ===
                                    editingId
                            )?.id ||
                            generateClassId()
                        )
                        : generateClassId(),

                name:
                    className,

                section:
                    section,

                teacherId:
                    teacherId,

                teacherName:
                    teacherName,

                academicSession:
                    academicSession,

                maxStudents:
                    maxStudents,

                status:
                    status,

                studentCount:
                    editingId
                        ? (
                            classes.find(
                                item =>
                                    item.firestoreId ===
                                    editingId
                            )?.studentCount || 0
                        )
                        : 0,

                updatedAt:
                    new Date().toISOString()

            };


            /* =============================================
               SAVE TO FIRESTORE
            ============================================= */

            try {

                let classRef;


                if (editingId) {

                    classRef =
                        doc(
                            db,
                            "classes",
                            editingId
                        );


                    await setDoc(
                        classRef,
                        classData,
                        {
                            merge: true
                        }
                    );


                    alert(
                        "Class updated successfully."
                    );

                }

                else {

                    const classId =
                        classData.id;


                    classRef =
                        doc(
                            db,
                            "classes",
                            classId
                        );


                    await setDoc(
                        classRef,
                        {

                            ...classData,

                            createdAt:
                                new Date().toISOString()

                        }
                    );


                    alert(
                        "Class added successfully."
                    );

                }


                await loadClasses();


                closeClassModalFunction();

            }

            catch (error) {

                console.error(
                    "Error saving class:",
                    error
                );


                alert(
                    "Unable to save class. Check your Firestore rules and Firebase configuration."
                );

            }

        }
    );

}


/* =========================================================
   RENDER CLASSES
========================================================= */

function renderClasses() {

    if (
        !classesTableBody
    )
        return;


    const search =
        classSearch
            ? classSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedSection =
        sectionFilter
            ? sectionFilter.value
            : "";


    const filtered =
        classes.filter(
            classData => {

                const classId =
                    String(
                        classData.id || ""
                    ).toLowerCase();


                const className =
                    String(
                        classData.name || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||

                    classId.includes(
                        search
                    ) ||

                    className.includes(
                        search
                    );


                const matchesSection =
                    !selectedSection ||

                    classData.section ===
                    selectedSection;


                return (
                    matchesSearch &&
                    matchesSection
                );

            }
        );


    classesTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        if (emptyClasses) {

            emptyClasses.style.display =
                "block";

        }

        return;

    }


    if (emptyClasses) {

        emptyClasses.style.display =
            "none";

    }


    filtered.forEach(
        classData => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <span class="student-id">

                        ${escapeHTML(
                            classData.id
                        )}

                    </span>

                </td>


                <td>

                    <strong>

                        ${escapeHTML(
                            classData.name
                        )}

                    </strong>

                </td>


                <td>

                    ${escapeHTML(
                        classData.section
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        classData.teacherName ||
                        "No Class Teacher"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        classData.studentCount ||
                        0
                    )}

                    /

                    ${escapeHTML(
                        classData.maxStudents ||
                        0
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        classData.academicSession
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${
                            classData.status ===
                            "Active"

                                ? "status-active"

                                : "status-inactive"
                        }
                    ">

                        ${escapeHTML(
                            classData.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="Edit"
                            data-edit-class="${escapeAttribute(
                                classData.firestoreId
                            )}"
                        >
                            ✏️
                        </button>


                        <button
                            class="table-action"
                            title="Delete"
                            data-delete-class="${escapeAttribute(
                                classData.firestoreId
                            )}"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            classesTableBody.appendChild(
                row
            );

        }
    );


    /* =============================================
       EDIT BUTTONS
    ============================================= */

    document
        .querySelectorAll(
            "[data-edit-class]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        editClass(
                            this.dataset.editClass
                        );

                    }
                );

            }
        );


    /* =============================================
       DELETE BUTTONS
    ============================================= */

    document
        .querySelectorAll(
            "[data-delete-class]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        deleteClass(
                            this.dataset.deleteClass
                        );

                    }
                );

            }
        );

}


/* =========================================================
   EDIT CLASS
========================================================= */

function editClass(
    firestoreId
) {

    const classData =
        classes.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!classData)
        return;


    openClassModal(
        classData
    );

}


/* =========================================================
   DELETE CLASS
========================================================= */

async function deleteClass(
    firestoreId
) {

    const classData =
        classes.find(
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (!classData)
        return;


    const confirmed =
        confirm(
            `Delete ${classData.name}?`
        );


    if (!confirmed)
        return;


    try {

        await deleteDoc(

            doc(
                db,
                "classes",
                firestoreId
            )

        );


        alert(
            "Class deleted successfully."
        );


        await loadClasses();

    }

    catch (error) {

        console.error(
            "Error deleting class:",
            error
        );


        alert(
            "Unable to delete class."
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

if (classSearch) {

    classSearch.addEventListener(
        "input",
        renderClasses
    );

}


/* =========================================================
   SECTION FILTER
========================================================= */

if (sectionFilter) {

    sectionFilter.addEventListener(
        "change",
        renderClasses
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
   ATTRIBUTE ESCAPE
========================================================= */

function escapeAttribute(
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
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeClassesPage() {

    await loadTeachers();

    await loadClasses();

}


initializeClassesPage();