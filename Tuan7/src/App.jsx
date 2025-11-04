import React, { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import ResultTable from "./components/ResultTable";
import "./App.css"; // Assuming basic CSS, similar to style.css

function App() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // nếu truyền vào là rỗng
    if (!studentId) {
      setStudent(null);
      setResults([]);
      setError("");
      return;
    }

    const fetchData = async () => {
      // Set trạng thái là đang tải laoding
      setIsLoading(true);
      setError("");
      try {
        // Chờ
        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        // Đọc dữ liệu từ file
        const [students, courses, grades] = await Promise.all([
          fetch("sinhvien.json").then((res) => res.json()),
          fetch("hocphan.json").then((res) => res.json()),
          fetch("ketqua.json").then((res) => res.json()),
        ]);

        console.log({ students, courses, grades });

        // TÌm
        const foundStudent = students.find((s) => s.sid === studentId);
        if (!foundStudent) {
          throw new Error(`Không tìm thấy sinh viên có mã ${studentId}`);
        }

        // Lấy điểm
        const myGrades = grades.filter((g) => g.sid === studentId);
        // Lấy dnah sách
        const enrichedResults = myGrades.map((g) => {
          const course = courses.find((c) => c.cid === g.cid) || {};
          return {
            cid: g.cid,
            courseName: course.name || "(Không rõ)",
            credits: course.credits || 0,
            term: g.term,
            score: g.score,
            letter: scoreToLetter(g.score),
          };
        });

        setStudent(foundStudent); // Set STUDENT TÌM THẤy
        setResults(enrichedResults); // Kết quả học tập
      } catch (err) {
        setError(err.message);
        setStudent(null);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const handleSearch = (id) => {
    setStudentId(id.trim());
  };

  const scoreToLetter = (score) => {
    if (score >= 9.5) return "A+";
    if (score >= 8.5) return "A";
    if (score >= 8.0) return "B+";
    if (score >= 7.0) return "B";
    if (score >= 6.5) return "C+";
    if (score >= 5.5) return "C";
    if (score >= 5.0) return "D+";
    if (score >= 4.0) return "D";
    return "F";
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Trang tra cứu kết quả học tập</h1>
        <SearchForm onSearch={handleSearch} />
        {isLoading && <div className="status">Đang tải...</div>}
        {error && <div className="status error">{error}</div>}
        {student && (
          <div className="student-info" >
            <strong>{student.name}</strong> — Mã: {student.sid} — Ngày sinh:{" "}
            {student.dob}
          </div>
        )}
        {results.length > 0 && <ResultTable results={results} />}
        {student && results.length === 0 && (
          <div className="status">Không có kết quả học phần.</div>
        )}
      </div>
    </div>
  );
}

export default App;
