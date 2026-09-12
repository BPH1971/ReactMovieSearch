import { useState } from "react";

// Controlled search input + button. Notifies the parent via onSearch.
export default function SearchBar({ onSearch, disabled }) {
  const [value, setValue] = useState("");

  function submit() {
    onSearch(value);
  }

  return (
    <div className="search-wrap">
      <div className="search-field">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search for a film — e.g. Heat, Amélie, Spirited Away…"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
      </div>
      <button
        className="search-go"
        onClick={submit}
        disabled={disabled}
      >
        Search
      </button>
    </div>
  );
}
