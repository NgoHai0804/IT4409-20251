import React from "react";

function ResultTable({ results = [] }) {
  if (!results || results.length === 0) {
    return <div className="results-table-empty">Không có kết quả</div>;
  }

  return (
    <table className="results-table" aria-label="Bảng kết quả học tập">
      <caption>Kết quả học tập</caption>
      <thead>
        <tr>
          <th>Mã học phần</th>
          <th>Tên học phần</th>
          <th>Số tín chỉ</th>
          <th>Học kỳ</th>
          <th>Điểm (hệ 10)</th>
          <th>Điểm chữ</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => {
          // Bảng kêt quả học tập
          const cid = result?.cid ?? "-";
          const courseName = result?.courseName ?? "-";
          const credits = result?.credits ?? "-";
          const term = result?.term ?? "-";
          const score =
            typeof result?.score === "number"
              ? result.score.toFixed(2)
              : result?.score ?? "-";
          const letter = result?.letter ?? "-";

          return (
            <tr>
              <td>{cid}</td>
              <td>{courseName}</td>
              <td>{credits}</td>
              <td>{term}</td>
              <td>{score}</td>
              <td>{letter}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ResultTable;
