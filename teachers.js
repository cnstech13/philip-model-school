/* =========================
   TEACHER DATABASE
   FIRESTORE VERSION
========================= */

let teachers = [];


/* =========================
   ELEMENTS
========================= */

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


/* =========================
   FIRESTORE COLLECTION
========================= */

const teachersCollection =
    db.collection("teachers");


/* =========================
   GENERATE TEACHER ID
========================= */

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


/* =========================
   LOAD TEACHERS
========================= */

async function loadTeachers() {

    try {

        const snapshot =
            await teachersCollection
                .orderBy("createdAt", "desc")
                .get();


        teachers =
            snapshot.docs.map(doc => ({

                ...doc.data(),

                firestoreId: doc.id

            }));


        renderTeachers();

    }

    catch (error) {

        console.error(
            "Error loading teachers:",
            error
        );


        alert(
            "Unable to load teachers from Firestore."
        );

    }

}


/* =========================
   OPEN MODAL
========================= */

function openTeacherModal(
    teacher = null
) {

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
            teacher.id;


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
            teacher.status || "";


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


/* =========================
   CLOSE MODAL
========================= */

function closeTeacherModalFunction() {

    teacherModal.classList.remove(
        "show"
    );

    teacherForm.reset();

}


addTeacherBtn.addEventListener(
    "click",
    () => openTeacherModal()
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


/* =========================
   SAVE TEACHER
========================= */

teacherForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const editingId =
            document.getElementById(
                "editingTeacherId"
            ).value;


        const teacherData = {

            firstName:
                document.getElementById(
                    "teacherFirstName"
                ).value.trim(),

            lastName:
                document.getElementById(
                    "teacherLastName"
                ).value.trim(),

            gender:
                document.getElementById(
                    "teacherGender"
                ).value,

            qualification:
                document.getElementById(
                    "teacherQualification"
                ).value.trim(),

            specialization:
                document.getElementById(
                    "teacherSpecialization"
                ).value.trim(),

            phone:
                document.getElementById(
                    "teacherPhone"
                ).value.trim(),

            email:
                document.getElementById(
                    "teacherEmail"
                ).value.trim(),

            employmentDate:
                document.getElementById(
                    "employmentDate"
                ).value,

            status:
                document.getElementById(
                    "teacherStatus"
                ).value,

            address:
                document.getElementById(
                    "teacherAddress"
                ).value.trim()

        };


        try {

            /* =====================
               EDIT EXISTING TEACHER
            ===================== */

            if (editingId) {

                const teacher =
                    teachers.find(
                        item =>
                            item.id ===
                            editingId
                    );


                if (!teacher) {

                    alert(
                        "Teacher not found."
                    );

                    return;

                }


                await teachersCollection
                    .doc(
                        teacher.firestoreId
                    )
                    .update(
                        teacherData
                    );

            }


            /* =====================
               ADD NEW TEACHER
            ===================== */

            else {

                const teacherId =
                    generateTeacherId();


                const newTeacher = {

                    id:
                        teacherId,

                    ...teacherData,

                    createdAt:
                        firebase.firestore.FieldValue.serverTimestamp()

                };


                await teachersCollection
                    .doc(teacherId)
                    .set(
                        newTeacher
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
                "Unable to save teacher. Please try again."
            );

        }

    }
);


/* =========================
   RENDER TEACHERS
========================= */

function renderTeachers() {

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


                const email =
                    String(
                        teacher.email || ""
                    ).toLowerCase();


                const teacherId =
                    String(
                        teacher.id || ""
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
                            teacher.status === "Active"
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
                            onclick="editTeacher('${escapeHTML(teacher.id)}')"
                        >

                            ✏️

                        </button>


                        <button
                            class="table-action"
                            title="Delete"
                            onclick="deleteTeacher('${escapeHTML(teacher.id)}')"
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

}


/* =========================
   EDIT TEACHER
========================= */

function editTeacher(id) {

    const teacher =
        teachers.find(
            item =>
                item.id === id
        );


    if (teacher) {

        openTeacherModal(
            teacher
        );

    }

}


/* =========================
   DELETE TEACHER
========================= */

async function deleteTeacher(id) {

    const teacher =
        teachers.find(
            item =>
                item.id === id
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

        await teachersCollection
            .doc(
                teacher.firestoreId
            )
            .delete();


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


/* =========================
   SEARCH / FILTER
========================= */

teacherSearch.addEventListener(
    "input",
    renderTeachers
);


teacherStatusFilter.addEventListener(
    "change",
    renderTeachers
);


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(value) {

    return String(value)
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

loadTeachers();