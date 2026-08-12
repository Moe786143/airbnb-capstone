import { Link } from 'react-router-dom';

/**
 * Catch-all page for URLs that match no route, so a mistyped address shows
 * a styled page with a way back rather than a blank screen.
 */
export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty-state">
        <h1 className="empty-state__title">Page not found</h1>
        <p className="empty-state__text">
          That page doesn&apos;t exist in the host dashboard.
        </p>
        <Link to="/" className="btn btn--primary">
          Back to your listings
        </Link>
      </div>
    </div>
  );
}
