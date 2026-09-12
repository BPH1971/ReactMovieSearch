// Rating-threshold filter + sort-field selector + sort-direction toggle.
export default function SortControls({
  threshold,
  onThresholdChange,
  sortField,
  onSortFieldChange,
  sortDescending,
  onSortDirectionToggle,
}) {
  const label = threshold <= 0 ? "Any ≥ 0.0" : `≥ ${threshold.toFixed(1)}`;

  return (
    <div className="controls-row">
      <span className="sort-label">Min rating</span>
      <div className="slider-track-wrap">
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={threshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          aria-label="Minimum rating threshold"
        />
      </div>
      <span className="slider-value">{label}</span>

      <span className="sort-label">Sort by</span>
      <select
        className="sort-select"
        value={sortField}
        onChange={(e) => onSortFieldChange(e.target.value)}
        aria-label="Sort field"
      >
        <option value="rating">Rating</option>
        <option value="year">Year</option>
        <option value="title">Title</option>
      </select>

      <button
        className="sort-dir-btn"
        title="Toggle sort direction"
        onClick={onSortDirectionToggle}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: sortDescending ? "scaleY(1)" : "scaleY(-1)" }}
        >
          <path d="M3 6h18M7 12h10M11 18h2"></path>
        </svg>
        <span>{sortDescending ? "Highest first" : "Lowest first"}</span>
      </button>
    </div>
  );
}
