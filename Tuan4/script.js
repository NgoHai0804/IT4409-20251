let originalRows = []; // Lưu hàng gốc để reset

// Khởi tạo
document.addEventListener("DOMContentLoaded", function () {
  const rows = document.querySelectorAll("#resultsTable tbody tr");
  originalRows = Array.from(rows);
});

function highlightResults() {
  const rows = document.querySelectorAll("#resultsTable tbody tr:not(.hidden)");
  rows.forEach((row) => {
    const gradeCell = row.cells[5]; // Cột điểm chữ
    const grade = gradeCell.textContent.trim();
    row.classList.remove("highlight-a", "highlight-f");
    if (grade === "A" || grade === "A+") {
      row.classList.add("highlight-a");
    } else if (grade === "F") {
      row.classList.add("highlight-f");
    }
  });
}

function calculateGPA() {
  const rows = document.querySelectorAll("#resultsTable tbody tr:not(.hidden)");
  const gradeMap = {
    A: 4.0,
    "A+": 4.0,
    "B+": 3.5,
    B: 3.0,
    "C+": 2.5,
    C: 2.0,
    "D+": 1.5,
    D: 1.0,
    F: 0.0,
  };
  let gpa1 = { totalCredits: 0, totalPoints: 0 };
  let gpa2 = { totalCredits: 0, totalPoints: 0 };

  rows.forEach((row) => {
    const semester = row.dataset.semester;
    const credits = parseFloat(row.cells[3].textContent);
    const grade = row.cells[5].textContent.trim();
    const gpaValue = gradeMap[grade] || 0;
    const points = gpaValue * credits;

    if (semester === "2024.1") {
      gpa1.totalCredits += credits;
      gpa1.totalPoints += points;
    } else if (semester === "2024.2") {
      gpa2.totalCredits += credits;
      gpa2.totalPoints += points;
    }
  });

  const gpa20241 =
    gpa1.totalCredits > 0
      ? (gpa1.totalPoints / gpa1.totalCredits).toFixed(2)
      : 0;
  const gpa20242 =
    gpa2.totalCredits > 0
      ? (gpa2.totalPoints / gpa2.totalCredits).toFixed(2)
      : 0;

  document.getElementById(
    "gpaOutput"
  ).innerHTML = `GPA 2024.1: ${gpa20241} | GPA 2024.2: ${gpa20242}`;
}

function filterResults() {
  const rows = document.querySelectorAll("#resultsTable tbody tr");
  rows.forEach((row) => {
    const gradeCell = row.cells[5];
    const grade = gradeCell.textContent.trim();
    if (grade === "A" || grade === "A+") {
      row.classList.remove("hidden");
    } else {
      row.classList.add("hidden");
    }
  });
}

function sortResults() {
  const tbody = document.querySelector("#resultsTable tbody");
  const rows = Array.from(tbody.querySelectorAll("tr:not(.hidden)"));
  rows.sort((a, b) => {
    const scoreA = parseFloat(a.cells[4].textContent);
    const scoreB = parseFloat(b.cells[4].textContent);
    return scoreA - scoreB;
  });
  // Xóa và thêm lại theo thứ tự
  rows.forEach((row) => tbody.appendChild(row));
}

function resetTable() {
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";
  originalRows.forEach((row) => {
    const clonedRow = row.cloneNode(true);
    clonedRow.classList.remove("hidden", "highlight-a", "highlight-f");
    tbody.appendChild(clonedRow);
  });
  document.getElementById("gpaOutput").innerHTML = "";
}
