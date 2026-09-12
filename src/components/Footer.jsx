// Site footer. Sits below the fold on every page.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          Built with React. Movie data from the{" "}
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noreferrer"
          >
            OMDb API
          </a>
          .
        </p>
        <p className="footer-muted">
          This product uses the OMDb API but is not endorsed or certified by
          OMDb.
        </p>
      </div>
    </footer>
  );
}
