/* =========================================================
   PHILIP MODEL SCHOOL
   RESULTS MANAGEMENT
   FIRESTORE VERSION
========================================================= */

import {
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


/* =========================================================
   DATABASE COLLECTIONS
========================================================= */

const resultsCollection =
    collection(db, "results");

const studentsCollection =
    collection(db, "students");

const subjectsCollection =
    collection(db, "subjects");

const classesCollection =
    collection(db, "classes");


/* =========================================================
   LOCAL DATA
========================================================= */

let results = [];
let students = [];
let subjects = [];
let classes = [];


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

const resultSessionFilter =
    document.getElementById("resultSessionFilter");

const resultTermFilter =
    document.getElementById("resultTermFilter");

const resultClassFilter =
    document.getElementById("resultClassFilter");

const resultSearch =
    document.getElementById("resultSearch");

const resultSession =
    document.getElementById("resultSession");

const resultTerm =
    document.getElementById("resultTerm");

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

const editingResultId =
    document.getElementById("editingResultId");


/* =========================================================
   BULK RESULT ELEMENTS
========================================================= */

const bulkResultBtn =
    document.getElementById("bulkResultBtn");

const bulkResultModal =
    document.getElementById("bulkResultModal");

const closeBulkResultModal =
    document.getElementById("closeBulkResultModal");

const cancelBulkResultBtn =
    document.getElementById("cancelBulkResultBtn");

const bulkSession =
    document.getElementById("bulkSession");

const bulkTerm =
    document.getElementById("bulkTerm");

const bulkClass =
    document.getElementById("bulkClass");

const bulkSubject =
    document.getElementById("bulkSubject");

const loadClassStudentsBtn =
    document.getElementById(
        "loadClassStudentsBtn"
    );

const bulkResultTableContainer =
    document.getElementById(
        "bulkResultTableContainer"
    );

const bulkResultTableBody =
    document.getElementById(
        "bulkResultTableBody"
    );

const saveBulkResultsBtn =
    document.getElementById(
        "saveBulkResultsBtn"
    );


/* =========================================================
   LOAD ALL DATA
========================================================= */

async function loadAllData() {

    try {

        await Promise.all([
            loadStudents(),
            loadSubjects(),
            loadClasses(),
            loadResults()
        ]);

        populateClassFilters();

    }

    catch (error) {

        console.error(
            "Error loading result data:",
            error
        );

        alert(
            "Unable to load result data from Firebase."
        );

    }

}


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

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

}


/* =========================================================
   LOAD SUBJECTS
========================================================= */

async function loadSubjects() {

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

}


/* =========================================================
   LOAD CLASSES
========================================================= */

async function loadClasses() {

    const snapshot =
        await getDocs(
            classesCollection
        );

    classes = [];

    snapshot.forEach(
        documentSnapshot => {

            classes.push({

                firestoreId:
                    documentSnapshot.id,

                ...documentSnapshot.data()

            });

        }
    );

}


/* =========================================================
   LOAD RESULTS
========================================================= */

async function loadResults() {

    const snapshot =
        await getDocs(
            resultsCollection
        );

    results = [];

    snapshot.forEach(
        documentSnapshot => {

            results.push({

                firestoreId:
                    documentSnapshot.id,

                ...documentSnapshot.data()

            });

        }
    );

    renderResults();

}


/* =========================================================
   POPULATE CLASS FILTERS
========================================================= */

function populateClassFilters() {

    const classNames = [
        ...new Set(

            classes
                .map(item =>
                    item.name ||
                    item.className
                )
                .filter(Boolean)

        )
    ];


    populateSelect(
        resultClassFilter,
        classNames,
        "All Classes"
    );


    populateSelect(
        resultClass,
        classNames,
        "Select Class"
    );


    populateSelect(
        bulkClass,
        classNames,
        "Select Class"
    );

}


/* =========================================================
   POPULATE SUBJECT SELECT
========================================================= */

function populateSubjectSelect() {

    resultSubject.innerHTML = `
        <option value="">
            Select Subject
        </option>
    `;


    subjects
        .filter(subject =>
            subject.status !== "Inactive"
        )
        .forEach(subject => {

            const option =
                document.createElement("option");

            option.value =
                subject.firestoreId;

            option.textContent =
                `${subject.name} (${subject.code || ""})`;

            resultSubject.appendChild(
                option
            );

        });

}


/* =========================================================
   BULK SUBJECT SELECT
========================================================= */

function populateBulkSubjectSelect() {

    bulkSubject.innerHTML = `
        <option value="">
            Select Subject
        </option>
    `;


    subjects
        .filter(subject =>
            subject.status !== "Inactive"
        )
        .forEach(subject => {

            const option =
                document.createElement("option");

            option.value =
                subject.firestoreId;

            option.textContent =
                `${subject.name} (${subject.code || ""})`;

            bulkSubject.appendChild(
                option
            );

        });

}


/* =========================================================
   GENERIC SELECT POPULATOR
========================================================= */

function populateSelect(
    select,
    values,
    defaultText
) {

    select.innerHTML = `
        <option value="">
            ${defaultText}
        </option>
    `;


    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value =
            value;

        option.textContent =
            value;

        select.appendChild(
            option
        );

    });

}


/* =========================================================
   LOAD STUDENTS FOR SELECTED CLASS
========================================================= */

function populateStudentsForClass(
    className
) {

    resultStudent.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;


    if (!className)
        return;


    const classStudents =
        students.filter(
            student =>
                student.class ===
                className
        );


    classStudents.forEach(
        student => {

            const option =
                document.createElement("option");

            option.value =
                student.firestoreId;

            option.textContent =
                `${student.firstName || ""} ${student.lastName || ""}`
                    .trim();

            resultStudent.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   OPEN RESULT MODAL
========================================================= */

function openResultModal(
    result = null
) {

    resultModal.classList.add(
        "show"
    );


    populateSubjectSelect();


    if (result) {

        document.getElementById(
            "resultModalTitle"
        ).textContent =
            "Edit Result";


        editingResultId.value =
            result.firestoreId;


        resultSession.value =
            result.session || "";


        resultTerm.value =
            result.term || "";


        resultClass.value =
            result.class || "";


        populateStudentsForClass(
            result.class
        );


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


        editingResultId.value =
            "";


        document.getElementById(
            "resultModalTitle"
        ).textContent =
            "Enter Result";


        resultTotal.value =
            "0";


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

    editingResultId.value =
        "";

}


/* =========================================================
   OPEN BULK MODAL
========================================================= */

function openBulkModal() {

    bulkResultModal.classList.add(
        "show"
    );


    populateBulkSubjectSelect();


    bulkResultTableBody.innerHTML =
        "";


    bulkResultTableContainer.style.display =
        "none";


    saveBulkResultsBtn.style.display =
        "none";

}


/* =========================================================
   CLOSE BULK MODAL
========================================================= */

function closeBulkModal() {

    bulkResultModal.classList.remove(
        "show"
    );

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

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


bulkResultBtn.addEventListener(
    "click",
    openBulkModal
);


closeBulkResultModal.addEventListener(
    "click",
    closeBulkModal
);


cancelBulkResultBtn.addEventListener(
    "click",
    closeBulkModal
);


/* =========================================================
   CLOSE MODALS OUTSIDE
========================================================= */

resultModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            resultModal
        ) {

            closeResultModalFunction();

        }

    }
);


bulkResultModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            bulkResultModal
        ) {

            closeBulkModal();

        }

    }
);


/* =========================================================
   CLASS CHANGE
========================================================= */

resultClass.addEventListener(
    "change",
    () => {

        populateStudentsForClass(
            resultClass.value
        );

    }
);


/* =========================================================
   SCORE CALCULATION
========================================================= */

function calculateResult() {

    const score1 =
        Number(ca1.value) || 0;

    const score2 =
        Number(ca2.value) || 0;

    const examination =
        Number(exam.value) || 0;


    const total =
        score1 +
        score2 +
        examination;


    resultTotal.value =
        total;


    const grade =
        getGrade(total);


    resultGrade.value =
        grade;


    resultRemark.value =
        getRemark(total);

}


/* =========================================================
   GRADE
========================================================= */

function getGrade(score) {

    if (score >= 70)
        return "A";

    if (score >= 60)
        return "B";

    if (score >= 50)
        return "C";

    if (score >= 45)
        return "D";

    if (score >= 40)
        return "E";

    return "F";

}


/* =========================================================
   REMARK
========================================================= */

function getRemark(score) {

    if (score >= 70)
        return "Excellent";

    if (score >= 60)
        return "Very Good";

    if (score >= 50)
        return "Good";

    if (score >= 45)
        return "Fair";

    if (score >= 40)
        return "Pass";

    return "Fail";

}


/* =========================================================
   SCORE INPUT EVENTS
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
   SAVE SINGLE RESULT
========================================================= */

resultForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        calculateResult();


        const session =
            resultSession.value;

        const term =
            resultTerm.value;

        const className =
            resultClass.value;

        const studentId =
            resultStudent.value;

        const subjectId =
            resultSubject.value;


        if (
            !session ||
            !term ||
            !className ||
            !studentId ||
            !subjectId
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }


        const student =
            students.find(
                item =>
                    item.firestoreId ===
                    studentId
            );


        const subject =
            subjects.find(
                item =>
                    item.firestoreId ===
                    subjectId
            );


        const resultData = {

            session,

            term,

            class:
                className,

            studentId,

            studentName:
                `${student?.firstName || ""} ${student?.lastName || ""}`
                    .trim(),

            subjectId,

            subjectName:
                subject?.name || "",

            subjectCode:
                subject?.code || "",

            ca1:
                Number(ca1.value) || 0,

            ca2:
                Number(ca2.value) || 0,

            exam:
                Number(exam.value) || 0,

            total:
                Number(resultTotal.value) || 0,

            grade:
                resultGrade.value,

            remark:
                resultRemark.value,

            updatedAt:
                new Date().toISOString()

        };


        try {

            if (editingResultId.value) {

                await updateDoc(

                    doc(
                        db,
                        "results",
                        editingResultId.value
                    ),

                    resultData

                );

                alert(
                    "Result updated successfully."
                );

            }

            else {

                await addDoc(
                    resultsCollection,
                    {
                        ...resultData,

                        createdAt:
                            new Date().toISOString()
                    }
                );


                alert(
                    "Result saved successfully."
                );

            }


            await loadResults();

            closeResultModalFunction();

        }

        catch (error) {

            console.error(
                "Error saving result:",
                error
            );


            alert(
                "Unable to save result. Check your Firestore rules and Firebase configuration."
            );

        }

    }
);


/* =========================================================
   RENDER RESULTS
========================================================= */

function renderResults() {

    const search =
        resultSearch.value
            .trim()
            .toLowerCase();


    const selectedSession =
        resultSessionFilter.value;


    const selectedTerm =
        resultTermFilter.value;


    const selectedClass =
        resultClassFilter.value;


    const filtered =
        results.filter(
            result => {

                const matchesSearch =
                    !search ||

                    String(
                        result.studentName || ""
                    )
                    .toLowerCase()
                    .includes(search) ||

                    String(
                        result.subjectName || ""
                    )
                    .toLowerCase()
                    .includes(search);


                const matchesSession =
                    !selectedSession ||
                    result.session ===
                    selectedSession;


                const matchesTerm =
                    !selectedTerm ||
                    result.term ===
                    selectedTerm;


                const matchesClass =
                    !selectedClass ||
                    result.class ===
                    selectedClass;


                return (
                    matchesSearch &&
                    matchesSession &&
                    matchesTerm &&
                    matchesClass
                );

            }
        );


    resultsTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        emptyResults.style.display =
            "block";

        return;

    }


    emptyResults.style.display =
        "none";


    filtered.forEach(
        result => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            result.studentName
                        )}
                    </strong>

                </td>


                <td>
                    ${escapeHTML(
                        result.class
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        result.subjectName
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
                            result.grade
                        )}
                    </strong>

                </td>


                <td>
                    ${escapeHTML(
                        result.remark
                    )}
                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="Edit"
                            onclick="editResult('${escapeAttribute(result.firestoreId)}')"
                        >
                            ✏️
                        </button>


                        <button
                            class="table-action"
                            title="Delete"
                            onclick="deleteResult('${escapeAttribute(result.firestoreId)}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            resultsTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   EDIT RESULT
========================================================= */

window.editResult =
    function(id) {

        const result =
            results.find(
                item =>
                    item.firestoreId ===
                    id
            );


        if (result) {

            openResultModal(
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
                    item.firestoreId ===
                    id
            );


        if (!result)
            return;


        const confirmed =
            confirm(
                `Delete result for ${result.studentName} in ${result.subjectName}?`
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


            await loadResults();


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
   BULK: LOAD STUDENTS
========================================================= */

loadClassStudentsBtn.addEventListener(
    "click",
    () => {

        const className =
            bulkClass.value;


        const session =
            bulkSession.value;


        const term =
            bulkTerm.value;


        const subjectId =
            bulkSubject.value;


        if (
            !className ||
            !session ||
            !term ||
            !subjectId
        ) {

            alert(
                "Please select session, term, class and subject."
            );

            return;

        }


        const classStudents =
            students.filter(
                student =>
                    student.class ===
                    className
            );


        if (
            classStudents.length === 0
        ) {

            alert(
                "No students were found in this class."
            );

            return;

        }


        bulkResultTableBody.innerHTML =
            "";


        classStudents.forEach(
            (student, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.studentId =
                    student.firestoreId;


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <strong>
                            ${escapeHTML(
                                `${student.firstName || ""} ${student.lastName || ""}`
                                    .trim()
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


                    <td class="bulk-total">
                        0
                    </td>


                    <td class="bulk-grade">
                        -
                    </td>


                    <td class="bulk-remark">
                        -
                    </td>

                `;


                bulkResultTableBody.appendChild(
                    row
                );


                addBulkCalculationEvents(
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
   BULK SCORE CALCULATION
========================================================= */

function addBulkCalculationEvents(
    row
) {

    const ca1Input =
        row.querySelector(".bulk-ca1");

    const ca2Input =
        row.querySelector(".bulk-ca2");

    const examInput =
        row.querySelector(".bulk-exam");


    const calculate = () => {

        const total =
            Number(ca1Input.value || 0) +
            Number(ca2Input.value || 0) +
            Number(examInput.value || 0);


        row.querySelector(
            ".bulk-total"
        ).textContent =
            total;


        row.querySelector(
            ".bulk-grade"
        ).textContent =
            getGrade(total);


        row.querySelector(
            ".bulk-remark"
        ).textContent =
            getRemark(total);

    };


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
   SAVE BULK RESULTS
========================================================= */

saveBulkResultsBtn.addEventListener(
    "click",
    async () => {

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


        const subject =
            subjects.find(
                item =>
                    item.firestoreId ===
                    subjectId
            );


        const rows =
            [
                ...bulkResultTableBody
                    .querySelectorAll("tr")
            ];


        if (
            rows.length === 0
        ) {

            alert(
                "Please load the class students first."
            );

            return;

        }


        saveBulkResultsBtn.disabled =
            true;

        saveBulkResultsBtn.textContent =
            "Saving...";


        try {

            for (
                const row of rows
            ) {

                const studentId =
                    row.dataset.studentId;


                const student =
                    students.find(
                        item =>
                            item.firestoreId ===
                            studentId
                    );


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


                const examination =
                    Number(
                        row.querySelector(
                            ".bulk-exam"
                        ).value
                    ) || 0;


                const total =
                    score1 +
                    score2 +
                    examination;


                const resultData = {

                    session,

                    term,

                    class:
                        className,

                    studentId,

                    studentName:
                        `${student?.firstName || ""} ${student?.lastName || ""}`
                            .trim(),

                    subjectId,

                    subjectName:
                        subject?.name || "",

                    subjectCode:
                        subject?.code || "",

                    ca1:
                        score1,

                    ca2:
                        score2,

                    exam:
                        examination,

                    total,

                    grade:
                        getGrade(total),

                    remark:
                        getRemark(total),

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()

                };


                await addDoc(
                    resultsCollection,
                    resultData
                );

            }


            alert(
                "All class results saved successfully."
            );


            await loadResults();

            closeBulkModal();

        }

        catch (error) {

            console.error(
                "Error saving bulk results:",
                error
            );


            alert(
                "Some results could not be saved. Check your Firebase configuration and Firestore rules."
            );

        }

        finally {

            saveBulkResultsBtn.disabled =
                false;

            saveBulkResultsBtn.textContent =
                "Save All Results";

        }

    }
);


/* =========================================================
   FILTERS
========================================================= */

resultSessionFilter.addEventListener(
    "change",
    renderResults
);


resultTermFilter.addEventListener(
    "change",
    renderResults
);


resultClassFilter.addEventListener(
    "change",
    renderResults
);


resultSearch.addEventListener(
    "input",
    renderResults
);


/* =========================================================
   ESCAPE HTML
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
   ESCAPE ATTRIBUTE
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
   INITIALIZE
========================================================= */

loadAllData();