import { useState } from "react";
import { Link } from "react-router-dom";

// Maps a numeric rating to the ticket-stub color class.
function ratingClass(rating) {
  if (rating === null || Number.isNaN(rating)) return "rating-na";
  if (rating >= 7) return "rating-high";
  if (rating >= 5) return "rating-mid";
  return "rating-low";
}

// One poster card. The whole card links to the movie's detail page.
export default function MovieCard({ movie }) {
  const [posterError, setPosterError] = useState(false);

  const hasPoster =
    movie.Poster && movie.Poster !== "N/A" && !posterError;

  const ratingNum =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? parseFloat(movie.imdbRating)
      : null;
  const ratingLabel = ratingNum !== null ? ratingNum.toFixed(1) : "—";
  const cls = ratingClass(ratingNum);

  const hasPlot = movie.Plot && movie.Plot !== "N/A";
  const plotText = hasPlot
    ? movie.Plot
    : "No synopsis available for this title.";

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="poster-card"
      aria-label={`View details for ${movie.Title}`}
    >
      <div className="poster-img-wrap">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            onError={() => setPosterError(true)}
          />
        ) : (
          <div className="poster-fallback">{movie.Title}</div>
        )}
        <div className={`ticket ${cls}`}>{ratingLabel}</div>
        <div className="plot-overlay">
          <p className="plot-overlay-title">{movie.Title}</p>
          <p className="plot-overlay-text">{plotText}</p>
          <p className="plot-overlay-hint">Click for details</p>
        </div>
      </div>
      <div className="card-body">
        <p className="card-title">{movie.Title}</p>
        <p className="card-year">{movie.Year || ""}</p>
      </div>
    </Link>
  );
}
