// Thin wrapper around the OMDb API.
// The detail cache lives here so the UI components stay simple and so
// re-fetching ratings for movies we've already seen is avoided.

const API_KEY = "8d64188f";
const API_BASE = "https://www.omdbapi.com/";

const detailCache = new Map(); // imdbID -> full detail object

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error contacting OMDb.");
  return res.json();
}

// Run a search by title. Returns { results, error }.
// `results` is an array of full detail objects (with imdbRating) when possible,
// falling back to the basic search info if an individual detail call fails.
export async function searchMovies(query) {
  const trimmed = (query || "").trim();
  if (!trimmed) {
    return { results: [], status: "idle" };
  }

  const searchUrl = `${API_BASE}?apikey=${API_KEY}&type=movie&s=${encodeURIComponent(
    trimmed
  )}`;
  const data = await fetchJson(searchUrl);

  if (data.Response === "False") {
    return {
      results: [],
      status: "empty",
      message: data.Error || "Try a different search term.",
    };
  }

  const basics = data.Search || [];

  const detailed = await Promise.all(
    basics.map(async (m) => {
      if (detailCache.has(m.imdbID)) return detailCache.get(m.imdbID);
      try {
        const detailUrl = `${API_BASE}?apikey=${API_KEY}&i=${m.imdbID}`;
        const full = await fetchJson(detailUrl);
        detailCache.set(m.imdbID, full);
        return full;
      } catch {
        return m; // fall back to basic info if a detail call fails
      }
    })
  );

  return { results: detailed, status: "success", found: basics.length };
}

// Fetch the full detail record for a single title by imdbID.
// Uses the same cache so a detail page load is instant if we've seen it.
export async function fetchMovieById(imdbID) {
  if (detailCache.has(imdbID)) return detailCache.get(imdbID);

  const detailUrl = `${API_BASE}?apikey=${API_KEY}&i=${encodeURIComponent(
    imdbID
  )}&plot=full`;
  const full = await fetchJson(detailUrl);
  detailCache.set(imdbID, full);
  return full;
}
