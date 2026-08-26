/* =========================================================
   CLASSES - FIRESTORE VERSION
   Philip Model School
========================================================= */

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { db } from "./firebase.js";


/* =========================================================
   DATABASE
========================================================= */

let classes = [];
let teachers = [];
let students = [];


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

const classTeacher =
    document.getElementById("classTeacher");

const addClassBtn =
    document.getElementById("addClassBtn");

const closeClassModal =
    document.getElementById("closeClassModal");

const cancelClassBtn =
    document.getElementById("cancelClassBtn");


/* =========================================================
   LOAD ALL DATA FROM FIRESTORE
========================================================= */

async function loadFirestoreData() {

    try {

        /* =========================
           LOAD CLASSES
        ========================== */

        const classesSnapshot =
            await getDocs(
                collection(db, "classes")
            );

        classes =
            classesSnapshot.docs.map(
                document => ({

                    id: document.id,

                    ...document.data()

                })
            );


        /* =========================
           LOAD TEACHERS
        ========================== */

        const teachersSnapshot =
            await getDocs(
                collection(db, "teachers")
            );

        teachers =
            teachersSnapshot.docs.map(
                document => ({

                    id: document.id,

                    ...document.data()

                })
            );


        /* =========================
           LOAD STUDENTS
        ========================== */

        const studentsSnapshot =
            await getDocs(
                collection(db, "students")
            );

        students =
            studentsSnapshot.docs.map(
                document => ({

                    id: document.id,

                    ...document.data()

                })
            );


        console.log(
            "Firestore data loaded successfully."
        );


    } catch (error) {

        console.error(
            "Error loading Firestore data:",
            error
        );

        alert(
            "Unable to load school data from Firestore."
        );

    }

}


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
                collection(db, "teachers")
            );


        teachers =
            snapshot.docs.map(
                document => ({

                    id: document.id,

                    ...document.data()

                })
            );


        classTeacher.innerHTML = `

            <option value="">
                No Class Teacher
            </option>

        `;


        teachers

            .filter(
                teacher =>
                    teacher.status === "Active"
            )

            .forEach(
                teacher => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        teacher.id;


                    option.textContent =
                        `${teacher.firstName || ""} ${teacher.lastName || ""} (${teacher.id})`;


                    classTeacher.appendChild(
                        option
                    );

                }
            );


    } catch (error) {

        console.error(
            "Error loading teachers:",
            error
        );

    }

}


/* =========================================================
   OPEN MODAL
========================================================= */

async function openClassModal(
    classData = null
) {

    await loadTeachers();


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
            classData.id;


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
            classData.academicSession || "";


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
            "40";

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeClassModalFunction() {

    classModal.classList.remove(
        "show"
    );


    classForm.reset();

}


addClassBtn.addEventListener(
    "click",
    () => openClassModal()
);


closeClassModal.addEventListener(
    "click",
    closeClassModalFunction
);


cancelClassBtn.addEventListener(
    "click",
    closeClassModalFunction
);


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


/* =========================================================
   SAVE CLASS TO FIRESTORE
========================================================= */

classForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const editingId =
            document.getElementById(
                "editingClassId"
            ).value;


        const name =
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


        /* =========================
           VALIDATION
        ========================== */

        if (
            !name ||
            !section ||
            !academicSession
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }


        /* =========================
           DUPLICATE CHECK
        ========================== */

        const duplicate =
            classes.some(
                item =>

                    item.name
                        ?.toLowerCase() ===
                    name.toLowerCase() &&

                    item.id !== editingId &&

                    item.academicSession ===
                    academicSession
            );


        if (duplicate) {

            alert(
                "This class already exists for this academic session."
            );

            return;

        }


        const classData = {

            name,

            section,

            teacherId,

            academicSession,

            maxStudents,

            status,

            updatedAt:
                new Date().toISOString()

        };


        try {

            /* =========================
               EDIT EXISTING CLASS
            ========================== */

            if (editingId) {

                const classRef =
                    doc(
                        db,
                        "classes",
                        editingId
                    );


                await updateDoc(
                    classRef,
                    classData
                );


                alert(
                    "Class updated successfully."
                );

            }


            /* =========================
               ADD NEW CLASS
            ========================== */

            else {

                const classId =
                    generateClassId();


                const classRef =
                    doc(
                        db,
                        "classes",
                        classId
                    );


                await import(
                    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
                ).then(
                    async module => {

                        await module.setDoc(
                            classRef,
                            {

                                id:
                                    classId,

                                ...classData,

                                createdAt:
                                    new Date().toISOString()

                            }
                        );

                    }
                );


                alert(
                    "Class added successfully."
                );

            }


            await loadFirestoreData();

            renderClasses();

            closeClassModalFunction();


        } catch (error) {

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


/* =========================================================
   GET TEACHER NAME
========================================================= */

function getTeacherName(
    teacherId
) {

    if (!teacherId)
        return "Not Assigned";


    const teacher =
        teachers.find(
            item =>
                item.id === teacherId
        );


    if (!teacher)
        return "Not Assigned";


    return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();

}


/* =========================================================
   COUNT STUDENTS
========================================================= */

function getStudentCount(
    className
) {

    return students.filter(
        student =>
            student.class ===
            className
    ).length;

}


/* =========================================================
   RENDER CLASSES
========================================================= */

function renderClasses() {

    const search =
        classSearch.value
            .trim()
            .toLowerCase();


    const selectedSection =
        sectionFilter.value;


    const filtered =
        classes.filter(
            item => {

                const matchesSearch =

                    !search ||

                    (item.name || "")
                        .toLowerCase()
                        .includes(search) ||

                    (item.id || "")
                        .toLowerCase()
                        .includes(search);


                const matchesSection =

                    !selectedSection ||

                    item.section ===
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

        emptyClasses.style.display =
            "block";

        return;

    }


    emptyClasses.style.display =
        "none";


    filtered.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );


            const studentCount =
                getStudentCount(
                    item.name
                );


            row.innerHTML = `

                <td>

                    <span class="student-id">

                        ${escapeHTML(
                            item.id
                        )}

                    </span>

                </td>


                <td>

                    <strong>

                        ${escapeHTML(
                            item.name
                        )}

                    </strong>

                </td>


                <td>

                    ${escapeHTML(
                        item.section
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        getTeacherName(
                            item.teacherId
                        )
                    )}

                </td>


                <td>

                    ${studentCount}
                    /
                    ${item.maxStudents || 0}

                </td>


                <td>

                    ${escapeHTML(
                        item.academicSession
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${
                            item.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                        }
                    ">

                        ${escapeHTML(
                            item.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="table-actions">


                        <button

                            class="table-action"

                            title="Edit"

                            onclick="
                                editClass('${escapeHTML(item.id)}')
                            "

                        >

                            ✏️

                        </button>


                        <button

                            class="table-action"

                            title="Delete"

                            onclick="
                                deleteClass('${escapeHTML(item.id)}')
                            "

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

}


/* =========================================================
   EDIT CLASS
========================================================= */

function editClass(id) {

    const classData =
        classes.find(
            item =>
                item.id === id
        );


    if (classData) {

        openClassModal(
            classData
        );

    }

}


/* =========================================================
   DELETE CLASS
========================================================= */

async function deleteClass(id) {

    const classData =
        classes.find(
            item =>
                item.id === id
        );


    if (!classData)
        return;


    const studentsInClass =
        getStudentCount(
            classData.name
        );


    if (
        studentsInClass > 0
    ) {

        alert(
            `This class has ${studentsInClass} student(s). Move the students to another class before deleting it.`
        );

        return;

    }


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
                id
            )
        );


        classes =
            classes.filter(
                item =>
                    item.id !== id
            );


        renderClasses();


        alert(
            "Class deleted successfully."
        );


    } catch (error) {

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

classSearch.addEventListener(
    "input",
    renderClasses
);


sectionFilter.addEventListener(
    "change",
    renderClasses
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
   INITIALIZE
========================================================= */

async function initializeClassesPage() {

    await loadFirestoreData();

    await loadTeachers();

    renderClasses();

}


initializeClassesPage();