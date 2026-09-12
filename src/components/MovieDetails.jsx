import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieById } from "../api/omdb";

// Full detail page for one title, loaded by imdbID from the URL.
export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | success

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setMovie(null);

    fetchMovieById(id)
      .then((data) => {
        if (!active) return;
        setMovie(data);
        setStatus(data.Response === "False" ? "error" : "success");
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="detail-loading">
        <div className="reel"></div>
        Rolling film…
      </div>
    );
  }

  if (status === "error" || !movie) {
    return (
      <div className="empty-state detail-empty">
        <span className="big">Something jammed in the projector.</span>
        We couldn't load this title.{" "}
        <Link to="/" className="detail-back-link">
          Back to search
        </Link>
        .
      </div>
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  const ratingNum =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? parseFloat(movie.imdbRating)
      : null;
  const ratingLabel = ratingNum !== null ? ratingNum.toFixed(1) : "—";
  const ratingClass =
    ratingNum === null
      ? "rating-na"
      : ratingNum >= 7
      ? "rating-high"
      : ratingNum >= 5
      ? "rating-mid"
      : "rating-low";

  // OMDb returns multiple ratings (Internet Movie Database, Rotten Tomatoes, Metacritic).
  const ratings =
    Array.isArray(movie.Ratings) && movie.Ratings.length
      ? movie.Ratings
      : [];

  return (
    <article className="detail">
      <Link to="/" className="detail-back">
        ← Back to results
      </Link>

      <div className="detail-grid">
        <div className="detail-poster">
          {hasPoster ? (
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
          ) : (
            <div className="poster-fallback">{movie.Title}</div>
          )}
          <div className={`ticket detail-ticket ${ratingClass}`}>
            {ratingLabel}
          </div>
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{movie.Title}</h1>
          <p className="detail-meta">
            {movie.Year} · {movie.Rated} · {movie.Runtime} · {movie.Genre}
          </p>

          {movie.imdbRating && movie.imdbRating !== "N/A" && (
            <p className="detail-imdb">
              <strong>IMDb:</strong> {movie.imdbRating}/10
              {movie.imdbVotes && movie.imdbVotes !== "N/A"
                ? ` (${movie.imdbVotes} votes)`
                : ""}
            </p>
          )}

          {ratings.length > 0 && (
            <ul className="detail-ratings">
              {ratings.map((r) => (
                <li key={r.Source}>
                  <span className="rating-source">{r.Source}</span>
                  <span className="rating-value">{r.Value}</span>
                </li>
              ))}
            </ul>
          )}

          {movie.Plot && movie.Plot !== "N/A" && (
            <p className="detail-plot">{movie.Plot}</p>
          )}

          <dl className="detail-credits">
            {movie.Director && movie.Director !== "N/A" && (
              <div>
                <dt>Director</dt>
                <dd>{movie.Director}</dd>
              </div>
            )}
            {movie.Writer && movie.Writer !== "N/A" && (
              <div>
                <dt>Writer</dt>
                <dd>{movie.Writer}</dd>
              </div>
            )}
            {movie.Actors && movie.Actors !== "N/A" && (
              <div>
                <dt>Cast</dt>
                <dd>{movie.Actors}</dd>
              </div>
            )}
            {movie.Released && movie.Released !== "N/A" && (
              <div>
                <dt>Released</dt>
                <dd>{movie.Released}</dd>
              </div>
            )}
            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <div>
                <dt>Box office</dt>
                <dd>{movie.BoxOffice}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </article>
  );
}
