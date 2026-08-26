/* =========================================================
   RESULTS MANAGEMENT - FIRESTORE VERSION
   Philip Model School Admin Portal
========================================================= */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { db } from "./firebase.js";


/* =========================================================
   FIRESTORE COLLECTIONS
========================================================= */

const resultsCollection =
    collection(db, "results");

const studentsCollection =
    collection(db, "students");

const classesCollection =
    collection(db, "classes");

const subjectsCollection =
    collection(db, "subjects");


/* =========================================================
   LOCAL MEMORY ONLY
   These are NOT localStorage.
========================================================= */

let results = [];
let students = [];
let classes = [];
let subjects = [];


/* =========================================================
   ELEMENTS
========================================================= */

const resultModal =
    document.getElementById("resultModal");

const resultForm =
    document.getElementById("resultForm");

const resultsTableBody =
    document.getElementById("resultsTableBody");

const emptyResults =
    document.getElementById("emptyResults");

const addResultBtn =
    document.getElementById("addResultBtn");

const closeResultModal =
    document.getElementById("closeResultModal");

const cancelResultBtn =
    document.getElementById("cancelResultBtn");

const resultClass =
    document.getElementById("resultClass");

const resultStudent =
    document.getElementById("resultStudent");

const resultSubject =
    document.getElementById("resultSubject");

const ca1 =
    document.getElementById("ca1");

const ca2 =
    document.getElementById("ca2");

const exam =
    document.getElementById("exam");

const resultTotal =
    document.getElementById("resultTotal");

const resultGrade =
    document.getElementById("resultGrade");

const resultRemark =
    document.getElementById("resultRemark");


/* =========================================================
   LOAD ALL DATA FROM FIRESTORE
========================================================= */

async function refreshData() {

    try {

        const [
            studentsSnapshot,
            classesSnapshot,
            subjectsSnapshot,
            resultsSnapshot
        ] = await Promise.all([

            getDocs(studentsCollection),

            getDocs(classesCollection),

            getDocs(subjectsCollection),

            getDocs(resultsCollection)

        ]);


        students =
            studentsSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


        classes =
            classesSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


        subjects =
            subjectsSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


        results =
            resultsSnapshot.docs.map(
                docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );


    }

    catch (error) {

        console.error(
            "Error loading Firestore data:",
            error
        );


        alert(
            "Unable to load result data from Firestore."
        );

    }

}


/* =========================================================
   GENERATE RESULT ID
========================================================= */

function generateResultId() {

    return `RES-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;

}


/* =========================================================
   LOAD CLASSES
========================================================= */

async function loadClasses() {

    await refreshData();


    resultClass.innerHTML = `

        <option value="">
            Select Class
        </option>

    `;


    classes
        .filter(
            item =>
                item.status === "Active"
        )
        .forEach(item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.name;


            option.textContent =
                item.name;


            resultClass.appendChild(
                option
            );

        });

}


/* =========================================================
   LOAD STUDENTS
========================================================= */

function loadStudents() {

    const selectedClass =
        resultClass.value;


    resultStudent.innerHTML = `

        <option value="">
            Select Student
        </option>

    `;


    if (!selectedClass)
        return;


    students
        .filter(
            student =>
                student.class ===
                selectedClass
        )
        .forEach(student => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                `${student.firstName} ${student.lastName} (${student.id})`;


            resultStudent.appendChild(
                option
            );

        });

}


/* =========================================================
   LOAD SUBJECTS
========================================================= */

async function loadSubjects() {

    await refreshData();


    resultSubject.innerHTML = `

        <option value="">
            Select Subject
        </option>

    `;


    subjects
        .filter(
            subject =>
                subject.status === "Active"
        )
        .forEach(subject => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject.id;


            option.textContent =
                `${subject.name} (${subject.code})`;


            resultSubject.appendChild(
                option
            );

        });

}


/* =========================================================
   OPEN RESULT MODAL
========================================================= */

async function openResultModal(
    result = null
) {

    await refreshData();

    await loadClasses();

    await loadSubjects();


    resultModal.classList.add(
        "show"
    );


    if (result) {

        document.getElementById(
            "resultModalTitle"
        ).textContent =
            "Edit Result";


        document.getElementById(
            "editingResultId"
        ).value =
            result.id;


        document.getElementById(
            "resultSession"
        ).value =
            result.session || "";


        document.getElementById(
            "resultTerm"
        ).value =
            result.term || "";


        resultClass.value =
            result.className || "";


        loadStudents();


        resultStudent.value =
            result.studentId || "";


        resultSubject.value =
            result.subjectId || "";


        ca1.value =
            result.ca1 ?? 0;


        ca2.value =
            result.ca2 ?? 0;


        exam.value =
            result.exam ?? 0;


        calculateResult();

    }

    else {

        resultForm.reset();


        document.getElementById(
            "resultModalTitle"
        ).textContent =
            "Enter Result";


        document.getElementById(
            "editingResultId"
        ).value =
            "";


        resultTotal.value =
            0;


        resultGrade.value =
            "";


        resultRemark.value =
            "";

    }

}


/* =========================================================
   CLOSE RESULT MODAL
========================================================= */

function closeResultModalFunction() {

    resultModal.classList.remove(
        "show"
    );

    resultForm.reset();

}


addResultBtn.addEventListener(
    "click",
    () => openResultModal()
);


closeResultModal.addEventListener(
    "click",
    closeResultModalFunction
);


cancelResultBtn.addEventListener(
    "click",
    closeResultModalFunction
);


resultModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            resultModal
        ) {

            closeResultModalFunction();

        }

    }
);


/* =========================================================
   CLASS CHANGE
========================================================= */

resultClass.addEventListener(
    "change",
    loadStudents
);


/* =========================================================
   GRADE FUNCTION
========================================================= */

function getGrade(total) {

    if (total >= 75) {

        return {
            grade: "A",
            remark: "Excellent"
        };

    }

    if (total >= 65) {

        return {
            grade: "B",
            remark: "Very Good"
        };

    }

    if (total >= 55) {

        return {
            grade: "C",
            remark: "Good"
        };

    }

    if (total >= 45) {

        return {
            grade: "D",
            remark: "Fair"
        };

    }

    if (total >= 40) {

        return {
            grade: "E",
            remark: "Pass"
        };

    }

    return {
        grade: "F",
        remark: "Fail"
    };

}


/* =========================================================
   CALCULATE RESULT
========================================================= */

function calculateResult() {

    const score1 =
        Number(ca1.value) || 0;


    const score2 =
        Number(ca2.value) || 0;


    const examScore =
        Number(exam.value) || 0;


    const total =
        score1 +
        score2 +
        examScore;


    const result =
        getGrade(total);


    resultTotal.value =
        total;


    resultGrade.value =
        result.grade;


    resultRemark.value =
        result.remark;

}


/* =========================================================
   SCORE EVENTS
========================================================= */

ca1.addEventListener(
    "input",
    calculateResult
);


ca2.addEventListener(
    "input",
    calculateResult
);


exam.addEventListener(
    "input",
    calculateResult
);


/* =========================================================
   CHECK DUPLICATE RESULT
========================================================= */

async function checkDuplicateResult(
    studentId,
    subjectId,
    session,
    term,
    editingId = ""
) {

    const q =
        query(
            resultsCollection,

            where(
                "studentId",
                "==",
                studentId
            ),

            where(
                "subjectId",
                "==",
                subjectId
            ),

            where(
                "session",
                "==",
                session
            ),

            where(
                "term",
                "==",
                term
            )
        );


    const snapshot =
        await getDocs(q);


    return snapshot.docs.some(
        docSnap =>
            docSnap.id !== editingId
    );

}


/* =========================================================
   SAVE RESULT
========================================================= */

resultForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        try {

            const editingId =
                document.getElementById(
                    "editingResultId"
                ).value;


            const session =
                document.getElementById(
                    "resultSession"
                ).value;


            const term =
                document.getElementById(
                    "resultTerm"
                ).value;


            const className =
                resultClass.value;


            const studentId =
                resultStudent.value;


            const subjectId =
                resultSubject.value;


            const score1 =
                Number(ca1.value);


            const score2 =
                Number(ca2.value);


            const examScore =
                Number(exam.value);


            const total =
                score1 +
                score2 +
                examScore;


            /* =====================
               VALIDATION
            ===================== */

            if (!studentId) {

                alert(
                    "Please select a student."
                );

                return;

            }


            if (!subjectId) {

                alert(
                    "Please select a subject."
                );

                return;

            }


            if (
                score1 < 0 ||
                score1 > 10
            ) {

                alert(
                    "CA 1 must be between 0 and 10."
                );

                return;

            }


            if (
                score2 < 0 ||
                score2 > 10
            ) {

                alert(
                    "CA 2 must be between 0 and 10."
                );

                return;

            }


            if (
                examScore < 0 ||
                examScore > 80
            ) {

                alert(
                    "Examination score must be between 0 and 80."
                );

                return;

            }


            /* =====================
               DUPLICATE CHECK
            ===================== */

            const duplicate =
                await checkDuplicateResult(
                    studentId,
                    subjectId,
                    session,
                    term,
                    editingId
                );


            if (duplicate) {

                alert(
                    "A result already exists for this student, subject, session and term."
                );

                return;

            }


            const gradeData =
                getGrade(total);


            const resultData = {

                session,

                term,

                className,

                studentId,

                subjectId,

                ca1: score1,

                ca2: score2,

                exam: examScore,

                total,

                grade:
                    gradeData.grade,

                remark:
                    gradeData.remark

            };


            /* =====================
               EDIT
            ===================== */

            if (editingId) {

                const resultRef =
                    doc(
                        db,
                        "results",
                        editingId
                    );


                await updateDoc(
                    resultRef,
                    {

                        ...resultData,

                        updatedAt:
                            serverTimestamp()

                    }
                );

            }


            /* =====================
               ADD
            ===================== */

            else {

                const newId =
                    generateResultId();


                const resultRef =
                    doc(
                        db,
                        "results",
                        newId
                    );


                await setDoc(
                    resultRef,
                    {

                        id:
                            newId,

                        ...resultData,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()

                    }
                );

            }


            await refreshData();

            await loadResultClassFilter();

            renderResults();


            closeResultModalFunction();


            alert(
                editingId
                    ? "Result updated successfully."
                    : "Result saved successfully."
            );

        }

        catch (error) {

            console.error(
                "Error saving result:",
                error
            );


            alert(
                "Unable to save result to Firestore."
            );

        }

    }
);


/* =========================================================
   GET STUDENT NAME
========================================================= */

function getStudentName(id) {

    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student)
        return "Unknown Student";


    return `${student.firstName} ${student.lastName}`;

}


/* =========================================================
   GET SUBJECT NAME
========================================================= */

function getSubjectName(id) {

    const subject =
        subjects.find(
            item =>
                item.id === id
        );


    if (!subject)
        return "Unknown Subject";


    return subject.name;

}


/* =========================================================
   RENDER RESULTS
========================================================= */

async function renderResults() {

    await refreshData();


    const search =
        document.getElementById(
            "resultSearch"
        ).value
            .trim()
            .toLowerCase();


    const session =
        document.getElementById(
            "resultSessionFilter"
        ).value;


    const term =
        document.getElementById(
            "resultTermFilter"
        ).value;


    const className =
        document.getElementById(
            "resultClassFilter"
        ).value;


    const filtered =
        results.filter(result => {

            const studentName =
                getStudentName(
                    result.studentId
                ).toLowerCase();


            const subjectName =
                getSubjectName(
                    result.subjectId
                ).toLowerCase();


            const matchesSearch =
                !search ||
                studentName.includes(search) ||
                subjectName.includes(search);


            const matchesSession =
                !session ||
                result.session === session;


            const matchesTerm =
                !term ||
                result.term === term;


            const matchesClass =
                !className ||
                result.className === className;


            return (
                matchesSearch &&
                matchesSession &&
                matchesTerm &&
                matchesClass
            );

        });


    resultsTableBody.innerHTML =
        "";


    if (filtered.length === 0) {

        emptyResults.style.display =
            "block";

        return;

    }


    emptyResults.style.display =
        "none";


    filtered.forEach(result => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>

                <strong>
                    ${escapeHTML(
                        getStudentName(
                            result.studentId
                        )
                    )}
                </strong>

            </td>


            <td>
                ${escapeHTML(
                    result.className
                )}
            </td>


            <td>
                ${escapeHTML(
                    getSubjectName(
                        result.subjectId
                    )
                )}
            </td>


            <td>
                ${result.ca1 ?? 0}
            </td>


            <td>
                ${result.ca2 ?? 0}
            </td>


            <td>
                ${result.exam ?? 0}
            </td>


            <td>

                <strong>
                    ${result.total ?? 0}
                </strong>

            </td>


            <td>

                <strong>
                    ${escapeHTML(
                        result.grade || ""
                    )}
                </strong>

            </td>


            <td>

                ${escapeHTML(
                    result.remark || ""
                )}

            </td>


            <td>

                <div class="table-actions">

                    <button
                        class="table-action"
                        onclick="editResult('${result.id}')"
                        title="Edit"
                    >
                        ✏️
                    </button>


                    <button
                        class="table-action"
                        onclick="deleteResult('${result.id}')"
                        title="Delete"
                    >
                        🗑️
                    </button>

                </div>

            </td>

        `;


        resultsTableBody.appendChild(
            row
        );

    });

}


/* =========================================================
   EDIT RESULT
========================================================= */

window.editResult =
    async function(id) {

        const result =
            results.find(
                item =>
                    item.id === id
            );


        if (result) {

            await openResultModal(
                result
            );

        }

    };


/* =========================================================
   DELETE RESULT
========================================================= */

window.deleteResult =
    async function(id) {

        const result =
            results.find(
                item =>
                    item.id === id
            );


        if (!result)
            return;


        const confirmed =
            confirm(
                "Delete this result?"
            );


        if (!confirmed)
            return;


        try {

            await deleteDoc(
                doc(
                    db,
                    "results",
                    id
                )
            );


            await refreshData();

            renderResults();


            alert(
                "Result deleted successfully."
            );

        }

        catch (error) {

            console.error(
                "Error deleting result:",
                error
            );


            alert(
                "Unable to delete result."
            );

        }

    };


/* =========================================================
   LOAD RESULT CLASS FILTER
========================================================= */

async function loadResultClassFilter() {

    await refreshData();


    const filter =
        document.getElementById(
            "resultClassFilter"
        );


    filter.innerHTML = `

        <option value="">
            All Classes
        </option>

    `;


    classes.forEach(item => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.name;


        option.textContent =
            item.name;


        filter.appendChild(
            option
        );

    });

}


/* =========================================================
   FILTER EVENTS
========================================================= */

document.getElementById(
    "resultSearch"
).addEventListener(
    "input",
    renderResults
);


document.getElementById(
    "resultSessionFilter"
).addEventListener(
    "change",
    renderResults
);


document.getElementById(
    "resultTermFilter"
).addEventListener(
    "change",
    renderResults
);


document.getElementById(
    "resultClassFilter"
).addEventListener(
    "change",
    renderResults
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   BULK RESULT ELEMENTS
========================================================= */

const bulkResultBtn =
    document.getElementById(
        "bulkResultBtn"
    );

const bulkResultModal =
    document.getElementById(
        "bulkResultModal"
    );

const closeBulkResultModal =
    document.getElementById(
        "closeBulkResultModal"
    );

const cancelBulkResultBtn =
    document.getElementById(
        "cancelBulkResultBtn"
    );

const bulkSession =
    document.getElementById(
        "bulkSession"
    );

const bulkTerm =
    document.getElementById(
        "bulkTerm"
    );

const bulkClass =
    document.getElementById(
        "bulkClass"
    );

const bulkSubject =
    document.getElementById(
        "bulkSubject"
    );

const loadClassStudentsBtn =
    document.getElementById(
        "loadClassStudentsBtn"
    );

const bulkResultTableBody =
    document.getElementById(
        "bulkResultTableBody"
    );

const bulkResultTableContainer =
    document.getElementById(
        "bulkResultTableContainer"
    );

const saveBulkResultsBtn =
    document.getElementById(
        "saveBulkResultsBtn"
    );


/* =========================================================
   LOAD BULK CLASSES
========================================================= */

async function loadBulkClasses() {

    await refreshData();


    bulkClass.innerHTML = `

        <option value="">
            Select Class
        </option>

    `;


    classes
        .filter(
            item =>
                item.status === "Active"
        )
        .forEach(item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.name;


            option.textContent =
                item.name;


            bulkClass.appendChild(
                option
            );

        });

}


/* =========================================================
   LOAD BULK SUBJECTS
========================================================= */

async function loadBulkSubjects() {

    await refreshData();


    bulkSubject.innerHTML = `

        <option value="">
            Select Subject
        </option>

    `;


    subjects
        .filter(
            subject =>
                subject.status === "Active"
        )
        .forEach(subject => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject.id;


            option.textContent =
                `${subject.name} (${subject.code})`;


            bulkSubject.appendChild(
                option
            );

    });

}


/* =========================================================
   OPEN BULK RESULT
========================================================= */

bulkResultBtn.addEventListener(
    "click",
    async function() {

        await loadBulkClasses();

        await loadBulkSubjects();


        bulkResultModal.classList.add(
            "show"
        );


        bulkResultTableContainer.style.display =
            "none";


        saveBulkResultsBtn.style.display =
            "none";


        bulkResultTableBody.innerHTML =
            "";

    }
);


/* =========================================================
   CLOSE BULK RESULT
========================================================= */

function closeBulkResult() {

    bulkResultModal.classList.remove(
        "show"
    );

}


closeBulkResultModal.addEventListener(
    "click",
    closeBulkResult
);


cancelBulkResultBtn.addEventListener(
    "click",
    closeBulkResult
);


bulkResultModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            bulkResultModal
        ) {

            closeBulkResult();

        }

    }
);


/* =========================================================
   LOAD STUDENTS FOR BULK RESULT
========================================================= */

loadClassStudentsBtn.addEventListener(
    "click",
    async function() {

        await refreshData();


        const className =
            bulkClass.value;


        const subjectId =
            bulkSubject.value;


        if (
            !bulkSession.value ||
            !bulkTerm.value ||
            !className ||
            !subjectId
        ) {

            alert(
                "Please complete all selections."
            );

            return;

        }


        const classStudents =
            students.filter(
                student =>
                    student.class ===
                    className &&
                    student.status ===
                    "Active"
            );


        bulkResultTableBody.innerHTML =
            "";


        if (
            classStudents.length === 0
        ) {

            alert(
                "No active students found in this class."
            );

            return;

        }


        classStudents.forEach(
            student => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.studentId =
                    student.id;


                row.innerHTML = `

                    <td>

                        <strong>
                            ${escapeHTML(
                                student.firstName
                            )}
                            ${escapeHTML(
                                student.lastName
                            )}
                        </strong>

                    </td>


                    <td>

                        <input
                            type="number"
                            class="bulk-ca1"
                            min="0"
                            max="10"
                            value="0"
                        >

                    </td>


                    <td>

                        <input
                            type="number"
                            class="bulk-ca2"
                            min="0"
                            max="10"
                            value="0"
                        >

                    </td>


                    <td>

                        <input
                            type="number"
                            class="bulk-exam"
                            min="0"
                            max="80"
                            value="0"
                        >

                    </td>


                    <td>
                        <strong
                            class="bulk-total"
                        >
                            0
                        </strong>
                    </td>


                    <td>
                        <strong
                            class="bulk-grade"
                        >
                            F
                        </strong>
                    </td>


                    <td
                        class="bulk-remark"
                    >
                        Fail
                    </td>

                `;


                bulkResultTableBody.appendChild(
                    row
                );


                setupBulkCalculation(
                    row
                );

            }
        );


        bulkResultTableContainer.style.display =
            "block";


        saveBulkResultsBtn.style.display =
            "inline-block";

    }
);


/* =========================================================
   BULK CALCULATION
========================================================= */

function setupBulkCalculation(row) {

    const ca1Input =
        row.querySelector(
            ".bulk-ca1"
        );


    const ca2Input =
        row.querySelector(
            ".bulk-ca2"
        );


    const examInput =
        row.querySelector(
            ".bulk-exam"
        );


    function calculate() {

        const score1 =
            Number(
                ca1Input.value
            ) || 0;


        const score2 =
            Number(
                ca2Input.value
            ) || 0;


        const examScore =
            Number(
                examInput.value
            ) || 0;


        const total =
            score1 +
            score2 +
            examScore;


        const gradeData =
            getGrade(total);


        row.querySelector(
            ".bulk-total"
        ).textContent =
            total;


        row.querySelector(
            ".bulk-grade"
        ).textContent =
            gradeData.grade;


        row.querySelector(
            ".bulk-remark"
        ).textContent =
            gradeData.remark;

    }


    ca1Input.addEventListener(
        "input",
        calculate
    );


    ca2Input.addEventListener(
        "input",
        calculate
    );


    examInput.addEventListener(
        "input",
        calculate
    );

}


/* =========================================================
   SAVE BULK RESULTS TO FIRESTORE
========================================================= */

saveBulkResultsBtn.addEventListener(
    "click",
    async function() {

        try {

            await refreshData();


            const session =
                bulkSession.value;


            const term =
                bulkTerm.value;


            const className =
                bulkClass.value;


            const subjectId =
                bulkSubject.value;


            if (
                !session ||
                !term ||
                !className ||
                !subjectId
            ) {

                alert(
                    "Please complete all selections."
                );

                return;

            }


            const rows =
                bulkResultTableBody
                    .querySelectorAll("tr");


            if (rows.length === 0) {

                alert(
                    "No students to save."
                );

                return;

            }


            const batch =
                writeBatch(db);


            let savedCount = 0;


            for (const row of rows) {

                const studentId =
                    row.dataset.studentId;


                const score1 =
                    Number(
                        row.querySelector(
                            ".bulk-ca1"
                        ).value
                    ) || 0;


                const score2 =
                    Number(
                        row.querySelector(
                            ".bulk-ca2"
                        ).value
                    ) || 0;


                const examScore =
                    Number(
                        row.querySelector(
                            ".bulk-exam"
                        ).value
                    ) || 0;


                /* VALIDATION */

                if (
                    score1 < 0 ||
                    score1 > 10 ||
                    score2 < 0 ||
                    score2 > 10 ||
                    examScore < 0 ||
                    examScore > 80
                ) {

                    alert(
                        "One or more scores are invalid."
                    );

                    return;

                }


                const total =
                    score1 +
                    score2 +
                    examScore;


                const gradeData =
                    getGrade(total);


                /* =====================
                   FIND EXISTING RESULT
                ===================== */

                const existing =
                    results.find(
                        result =>

                            result.studentId ===
                            studentId &&

                            result.subjectId ===
                            subjectId &&

                            result.session ===
                            session &&

                            result.term ===
                            term

                    );


                const resultData = {

                    session,

                    term,

                    className,

                    studentId,

                    subjectId,

                    ca1: score1,

                    ca2: score2,

                    exam: examScore,

                    total,

                    grade:
                        gradeData.grade,

                    remark:
                        gradeData.remark,

                    updatedAt:
                        serverTimestamp()

                };


                /* UPDATE */

                if (existing) {

                    const resultRef =
                        doc(
                            db,
                            "results",
                            existing.id
                        );


                    batch.update(
                        resultRef,
                        resultData
                    );

                }

                /* CREATE */

                else {

                    const newId =
                        generateResultId();


                    const resultRef =
                        doc(
                            db,
                            "results",
                            newId
                        );


                    batch.set(
                        resultRef,
                        {

                            id:
                                newId,

                            ...resultData,

                            createdAt:
                                serverTimestamp()

                        }
                    );

                }


                savedCount++;

            }


            await batch.commit();


            await refreshData();

            await loadResultClassFilter();

            renderResults();


            alert(
                `${savedCount} result(s) saved successfully.`
            );


            closeBulkResult();

        }

        catch (error) {

            console.error(
                "Error saving bulk results:",
                error
            );


            alert(
                "Unable to save bulk results to Firestore."
            );

        }

    });


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeResultsPage() {

    await refreshData();

    await loadResultClassFilter();

    await renderResults();

}


/* =========================================================
   START
========================================================= */

initializeResultsPage();