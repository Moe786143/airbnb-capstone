import { Link } from 'react-router-dom';

/**
 * Catch-all page for URLs that match no route, so a mistyped address gets a
 * styled page with a way back instead of a blank screen.
 */
export default function NotFoundPage() {
  return (
    <div className="container page">
      <div className="empty-state">
        <h1 className="empty-state__title">Page not found</h1>
        <p className="empty-state__text">
          We couldn&apos;t find the page you were looking for.
        </p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
