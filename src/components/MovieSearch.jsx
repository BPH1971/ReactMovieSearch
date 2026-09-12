import { useMemo, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SortControls from "./SortControls";
import MovieGrid from "./MovieGrid";
import { searchMovies } from "../api/omdb";

// Owns all page state and derives the filtered + sorted list.
export default function MovieSearch() {
  const [status, setStatus] = useState("idle"); // idle | loading | empty | error | success
  const [results, setResults] = useState([]);
  const [statusText, setStatusText] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [sortField, setSortField] = useState("rating"); // rating | year | title
  const [sortDescending, setSortDescending] = useState(true);

  // Guards against a slow search finishing after a newer one has started.
  const requestId = useRef(0);

  async function handleSearch(query) {
    const id = ++requestId.current;
    const trimmed = (query || "").trim();

    if (!trimmed) {
      setResults([]);
      setStatus("idle");
      setStatusText("");
      setStatusError(false);
      return;
    }

    setStatus("loading");
    setStatusText("Searching…");
    setStatusError(false);

    try {
      const { results: detailed, status: apiStatus, message, found } =
        await searchMovies(trimmed);
      if (id !== requestId.current) return; // a newer search superseded this one

      setResults(detailed);

      if (apiStatus === "empty") {
        setStatus("empty");
        setStatusText(message || "");
        return;
      }

      setStatus("success");
      const count = detailed.length;
      setStatusText(
        `Showing ${count} result${count === 1 ? "" : "s"}.` +
          (found ? ` Found ${found} — ratings fetched.` : "")
      );
    } catch (err) {
      if (id !== requestId.current) return;
      console.error(err);
      setResults([]);
      setStatus("error");
      setStatusText("Request failed.");
      setStatusError(true);
    }
  }

  // Filter by the rating threshold, then sort by the chosen field/direction.
  const visibleMovies = useMemo(() => {
    const filtered = results.filter((m) => {
      const r =
        m.imdbRating && m.imdbRating !== "N/A"
          ? parseFloat(m.imdbRating)
          : null;
      if (threshold <= 0) return true; // show all, including unrated, at minimum threshold
      return r !== null && r >= threshold;
    });

    const ratingOf = (m) =>
      m.imdbRating && m.imdbRating !== "N/A"
        ? parseFloat(m.imdbRating)
        : -1;
    const yearOf = (m) => {
      // OMDb Year can be "1998" or a range like "1998–2002"; take the first 4 digits.
      const match = String(m.Year || "").match(/\d{4}/);
      return match ? parseInt(match[0], 10) : -1;
    };

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortField === "rating") cmp = ratingOf(a) - ratingOf(b);
      else if (sortField === "year") cmp = yearOf(a) - yearOf(b);
      else cmp = String(a.Title).localeCompare(String(b.Title));
      return sortDescending ? -cmp : cmp;
    });

    return filtered;
  }, [results, threshold, sortField, sortDescending]);

  return (
    <>
      <header className="search-header">
        <p className="tagline">Now showing: anything you search for</p>
        <SearchBar onSearch={handleSearch} disabled={status === "loading"} />
        <SortControls
          threshold={threshold}
          onThresholdChange={setThreshold}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDescending={sortDescending}
          onSortDirectionToggle={() => setSortDescending((v) => !v)}
        />
      </header>

      <p className={`status-line${statusError ? " error" : ""}`}>
        {statusText}
      </p>

      <MovieGrid status={status} movies={visibleMovies} message={statusText} />
    </>
  );
}
