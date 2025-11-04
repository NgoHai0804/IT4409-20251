const DATA_PATH = "data/";

// ---- Hàm mô phỏng fetch bất đồng bộ ----
function fetchData(fileName) {
  return new Promise((resolve, reject) => {
    const delay = 400 + Math.random() * 800;
    setTimeout(async () => {
      try {
        const res = await fetch(DATA_PATH + fileName);
        if (!res.ok) throw new Error("Không tải được " + fileName);
        const data = await res.json();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
}

function scoreToLetter(score) {
  if (score >= 9.5) return "A+";
  if (score >= 8.5) return "A";
  if (score >= 8.0) return "B+";
  if (score >= 7.0) return "B";
  if (score >= 6.5) return "C+";
  if (score >= 5.5) return "C";
  if (score >= 5.0) return "D+";
  if (score >= 4.0) return "D";
  return "F";
}

// ---- Cache với localStorage ----
function cacheGet(sid) {
  const raw = localStorage.getItem("grades_cache_" + sid);
  return raw ? JSON.parse(raw) : null;
}

function cacheSet(sid, payload) {
  localStorage.setItem(
    "grades_cache_" + sid,
    JSON.stringify({ at: Date.now(), data: payload })
  );
}

function cacheClearAll() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith("grades_cache_"))
    .forEach((k) => localStorage.removeItem(k));
}

// ---- Các phần tử giao diện ----
const sidInput = document.getElementById("sidInput");
const lookupBtn = document.getElementById("lookupBtn");
const clearCacheBtn = document.getElementById("clearCacheBtn");
const statusEl = document.getElementById("status");
const studentInfo = document.getElementById("studentInfo");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");

// ---- Bắt sự kiện ----
lookupBtn.addEventListener("click", () => {
  const sid = sidInput.value.trim();
  doLookup(sid);
});
sidInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLookup(sidInput.value.trim());
});
clearCacheBtn.addEventListener("click", () => {
  cacheClearAll();
  statusEl.textContent = "Đã xóa cache.";
  studentInfo.innerHTML = "";
  resultsTable.style.display = "none";
});

// ---- Hàm chính: tra cứu ----
async function doLookup(sid) {
  if (!sid) {
    statusEl.textContent = "Vui lòng nhập mã số sinh viên.";
    statusEl.classList.add("error");
    return;
  }

  const cached = cacheGet(sid);
  if (cached) {
    statusEl.innerHTML = `Kết quả lấy từ <span class="cached">localStorage</span>.`;
    renderStudentAndResults(cached.data);
    return;
  }
  // ---- tải từ "server" ----
  statusEl.textContent = "Đang tải...";
  studentInfo.innerHTML = "";
  resultsTable.style.display = "none";

  try {
    const [students, courses, results] = await Promise.all([
      fetchData("sinhvien.json"),
      fetchData("hocphan.json"),
      fetchData("ketqua.json"),
    ]);

    const student = students.find((s) => s.sid === sid);
    if (!student) throw new Error("Không tìm thấy sinh viên có mã " + sid);

    const myResults = results.filter((r) => r.sid === sid);
    const enriched = myResults.map((r) => {
      const course = courses.find((c) => c.cid === r.cid) || {};
      return {
        cid: r.cid,
        courseName: course.name || "(Không rõ)",
        credits: course.credits || 0,
        term: r.term,
        score: r.score,
        letter: scoreToLetter(r.score),
      };
    });

    const payload = { student, results: enriched };
    cacheSet(sid, payload);
    statusEl.textContent = "Đã tải dữ liệu từ server.";
    renderStudentAndResults(payload);
  } catch (err) {
    statusEl.textContent = "Lỗi: " + err.message;
    statusEl.classList.add("error");
  }
}

// ---- Hiển thị ra bảng ----
function renderStudentAndResults(payload) {
  const { student, results } = payload;
  studentInfo.innerHTML = `<div><strong>${student.name}</strong> — Mã: ${student.sid} — Ngày sinh: ${student.dob}</div>`;
  resultsBody.innerHTML = "";

  if (!results.length) {
    resultsBody.innerHTML = `<tr><td colspan="6">Không có kết quả học phần.</td></tr>`;
    resultsTable.style.display = "table";
    return;
  }

  for (const r of results) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.cid}</td>
      <td>${r.courseName}</td>
      <td>${r.credits}</td>
      <td>${r.term}</td>
      <td>${r.score}</td>
      <td>${r.letter}</td>
    `;
    resultsBody.appendChild(tr);
  }
  resultsTable.style.display = "table";
}
