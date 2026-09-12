import { Link } from "react-router-dom";

// Works in both Vite (import.meta.env.BASE_URL) and CRA (process.env.PUBLIC_URL).
const PUBLIC_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.BASE_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.PUBLIC_URL) ||
  "/";

// Site navigation bar. Brand links home; sticky across pages.
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="Movie Search home">
          <img
            className="brand-logo"
            src={`${PUBLIC_URL}movie logo.png`}
            alt="Movie Search"
          />
          <span className="navbar-title">Movie Search</span>
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noreferrer"
            >
              OMDb API
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
