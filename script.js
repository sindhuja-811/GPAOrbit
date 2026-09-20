// ================================
// GPAOrbit v1.0
// Part 1
// ================================

// Add Subject
function addSubject() {

    let table = document.getElementById("subjectTable");

    let row = table.insertRow();

    row.innerHTML = `
        <td>
            <input type="text" placeholder="Subject Name">
        </td>

        <td>
            <input type="number"
                   class="credit"
                   min="0.5"
                   step="0.5"
                   placeholder="Credits">
        </td>

        <td>
            <select class="grade">
                <option value="10">S</option>
                <option value="9">A</option>
                <option value="8">B</option>
                <option value="7">C</option>
                <option value="6">D</option>
                <option value="5">E</option>
                <option value="0">F</option>
            </select>
        </td>

        <td style="text-align:center;">
            <button class="btn" onclick="removeRow(this)">
                ❌
            </button>
        </td>
    `;
}


// Remove Subject
function removeRow(button){

    let table = document.getElementById("subjectTable");

    if(table.rows.length > 2){

        button.parentElement.parentElement.remove();

    }else{

        alert("At least one subject is required.");

    }

}


// Calculate SGPA
function calculateSGPA(){

    let credits = document.querySelectorAll(".credit");
    let grades = document.querySelectorAll(".grade");

    let totalCredits = 0;
    let totalPoints = 0;

    for(let i=0;i<credits.length;i++){

        let credit = parseFloat(credits[i].value);

        if(!isNaN(credit) && credit>0){

            totalCredits += credit;
            totalPoints += credit * Number(grades[i].value);

        }

    }

    let sgpa = 0;

    if(totalCredits>0){

        sgpa = totalPoints / totalCredits;

    }

    document.getElementById("result").innerHTML =
    "SGPA : " + sgpa.toFixed(2);

    document.getElementById("totalCredits").innerHTML =
    "Total Credits : " + totalCredits;

}
// ================================
// GPAOrbit v1.0
// Part 2
// Save • Load • Reset
// ================================

// Save Semester
function saveSemester() {

    calculateSGPA();

    let semester = document.getElementById("semester").value;

    let rows = document.querySelectorAll("#subjectTable tr");

    let subjects = [];

    for (let i = 1; i < rows.length; i++) {

        let name = rows[i].cells[0].querySelector("input").value;
        let credit = rows[i].cells[1].querySelector("input").value;
        let grade = rows[i].cells[2].querySelector("select").value;

        subjects.push({
            name: name,
            credit: credit,
            grade: grade
        });

    }

    let data = {

        subjects: subjects,

        sgpa: document.getElementById("result").innerText.replace("SGPA : ", ""),

        totalCredits: document.getElementById("totalCredits").innerText.replace("Total Credits : ", "")

    };

    localStorage.setItem("semester" + semester, JSON.stringify(data));

    alert("Semester " + semester + " saved successfully!");

}


// Load Semester
function loadSemester() {

    let semester = document.getElementById("semester").value;

    let saved = localStorage.getItem("semester" + semester);

    let table = document.getElementById("subjectTable");

    // Remove all subject rows except the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    if (saved) {

        let data = JSON.parse(saved);

        data.subjects.forEach(subject => {

            let row = table.insertRow();

            row.innerHTML = `
                <td>
                    <input type="text" value="${subject.name}">
                </td>

                <td>
                    <input type="number"
                           class="credit"
                           min="0.5"
                           step="0.5"
                           value="${subject.credit}">
                </td>

                <td>
                    <select class="grade">
                        <option value="10" ${subject.grade=="10"?"selected":""}>S</option>
                        <option value="9" ${subject.grade=="9"?"selected":""}>A</option>
                        <option value="8" ${subject.grade=="8"?"selected":""}>B</option>
                        <option value="7" ${subject.grade=="7"?"selected":""}>C</option>
                        <option value="6" ${subject.grade=="6"?"selected":""}>D</option>
                        <option value="5" ${subject.grade=="5"?"selected":""}>E</option>
                        <option value="0" ${subject.grade=="0"?"selected":""}>F</option>
                    </select>
                </td>

                <td style="text-align:center;">
                    <button class="btn" onclick="removeRow(this)">❌</button>
                </td>
            `;
        });

        document.getElementById("result").innerHTML =
            "SGPA : " + data.sgpa;

        document.getElementById("totalCredits").innerHTML =
            "Total Credits : " + data.totalCredits;

    } else {

        // Fresh semester (empty row)
        let row = table.insertRow();

        row.innerHTML = `
            <td><input type="text" placeholder="Subject Name"></td>

            <td>
                <input type="number"
                       class="credit"
                       min="0.5"
                       step="0.5"
                       placeholder="Credits">
            </td>

            <td>
                <select class="grade">
                    <option value="10">S</option>
                    <option value="9">A</option>
                    <option value="8">B</option>
                    <option value="7">C</option>
                    <option value="6">D</option>
                    <option value="5">E</option>
                    <option value="0">F</option>
                </select>
            </td>

            <td style="text-align:center;">
                <button class="btn" onclick="removeRow(this)">❌</button>
            </td>
        `;

        document.getElementById("result").innerHTML = "SGPA : 0.00";
        document.getElementById("totalCredits").innerHTML = "Total Credits : 0";
    }

}


// Reset Semester
function resetSemester() {

    if (confirm("Clear all entered subjects?")) {

        let table = document.getElementById("subjectTable");

        while (table.rows.length > 2) {
            table.deleteRow(2);
        }

        table.rows[1].cells[0].querySelector("input").value = "";
        table.rows[1].cells[1].querySelector("input").value = "";
        table.rows[1].cells[2].querySelector("select").selectedIndex = 0;

        document.getElementById("result").innerHTML = "SGPA : 0.00";
        document.getElementById("totalCredits").innerHTML = "Total Credits : 0";
    }

}


// Automatically load saved semester
document.addEventListener("DOMContentLoaded", function () {

    let semester = document.getElementById("semester");

    if (semester) {

        loadSemester();

        semester.addEventListener("change", loadSemester);

    }

});
// ================================
// GPAOrbit v1.0
// Part 3
// Dashboard & CGPA
// ================================

// Calculate CGPA
function calculateCGPA() {

    let totalSGPA = 0;
    let completedSemesters = 0;

    for (let i = 1; i <= 8; i++) {

        let saved = localStorage.getItem("semester" + i);

        let semesterCard = document.getElementById("cgpaSem" + i);

        if (saved) {

            let data = JSON.parse(saved);

            totalSGPA += Number(data.sgpa);
            completedSemesters++;

            if (semesterCard) {
                semesterCard.innerHTML = "SGPA : " + data.sgpa;
            }

        } else {

            if (semesterCard) {
                semesterCard.innerHTML = "Not Saved";
            }

        }

    }
    let cgpa = completedSemesters > 0
        ? totalSGPA / completedSemesters
        : 0;

    let result = document.getElementById("cgpaResult");

    if (result) {
        result.innerHTML = "CGPA : " + cgpa.toFixed(2);
    }
    }

// Dashboard
function loadDashboard() {

    let totalSGPA = 0;
    let completed = 0;
    let best = 0;
    let lowest = 10;

    for (let i = 1; i <= 8; i++) {

        let saved = localStorage.getItem("semester" + i);

        let element = document.getElementById("sem" + i);

        if (saved) {

            let data = JSON.parse(saved);
            let sgpa = Number(data.sgpa);

            totalSGPA += sgpa;
            completed++;

            if (sgpa > best) best = sgpa;
            if (sgpa < lowest) lowest = sgpa;

            if (element) {
                element.innerHTML = "SGPA : " + sgpa;
            }

        } else {

            if (element) {
                element.innerHTML = "Not Saved";
            }
        }
    }

    let cgpa = completed > 0 ? (totalSGPA / completed).toFixed(2) : "0.00";

    if (document.getElementById("overallCGPA")) {
        document.getElementById("overallCGPA").innerHTML =
            "Overall CGPA : " + cgpa;
    }

    if (document.getElementById("completedCount")) {
        document.getElementById("completedCount").innerHTML =
            completed + " / 8";
    }

    if (document.getElementById("bestSGPA")) {
        document.getElementById("bestSGPA").innerHTML =
            completed > 0 ? best.toFixed(2) : "--";
    }

    if (document.getElementById("lowestSGPA")) {
        document.getElementById("lowestSGPA").innerHTML =
            completed > 0 ? lowest.toFixed(2) : "--";
    }

    if (document.getElementById("progressBar")) {
        document.getElementById("progressBar").style.width =
            (completed / 8) * 100 + "%";
    }
}


// Auto Load
window.onload = function () {

    if (document.getElementById("semester")) {
        loadSemester();
    }

    if (document.getElementById("cgpaResult")) {
        calculateCGPA();
    }

    if (document.getElementById("overallCGPA")) {
    console.log("Dashboard Loaded");
    loadDashboard();
}

};