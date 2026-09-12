import MovieCard from "./MovieCard";

// Renders the grid plus the empty / loading / error states.
export default function MovieGrid({ status, movies, message }) {
  if (status === "loading") {
    return (
      <div className="grid">
        <div className="loading-state">
          <div className="reel"></div>
          Rolling film…
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="grid">
        <div className="empty-state">
          <span className="big">Something jammed in the projector.</span>
          Check your connection and try again.
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="grid">
        <div className="empty-state">
          <span className="big">No reels found.</span>
          {message || "Try a different search term."}
        </div>
      </div>
    );
  }

  if (status === "success" && movies.length === 0) {
    return (
      <div className="grid">
        <div className="empty-state">
          <span className="big">No matches in the archive.</span>
          Try a different title or lower the rating threshold.
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="grid">
        <div className="empty-state">
          <span className="big">The house lights are up.</span>
          Search for a title above to start the screening.
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {movies.map((m) => (
        <MovieCard key={m.imdbID} movie={m} />
      ))}
    </div>
  );
}
