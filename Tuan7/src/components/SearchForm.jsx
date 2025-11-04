import React, { useState } from "react";

function SearchForm({ onSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nhập mã số sinh viên"
        className="sid-input"
      />
      <button type="submit">Tra cứu</button>
    </form>
  );
}

export default SearchForm;
