import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AccommodationCard from '../components/locations/AccommodationCard';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getAccommodations } from '../api/client';
import { useFetch } from '../hooks/useFetch';

/**
 * The filter pill row under the results heading (Figma's "Luxe Search").
 * Real, hoverable buttons — matching every other Figma-decoration control
 * in this app — but none of them actually filter anything: the app has no
 * cancellation policy, place type, price, or instant-book data to filter
 * by. The destination itself is chosen from the search pill in the header,
 * which is what actually drives this page (it stays in sync via the URL).
 */
const FILTER_PILLS = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters'];

/**
 * The search results page at `/locations`.
 *
 * The destination lives in the URL query string (`?location=Sandton`),
 * which makes results shareable and bookmarkable and lets the header
 * search pill and the home page's destination cards link straight into a
 * filtered view.
 */
export default function LocationsPage() {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location') || '';
  const guests = searchParams.get('guests') || '';

  // Re-fetches whenever the location or guest count in the URL changes.
  // (The API also supports a checkIn/checkOut availability filter, but
  // nothing in the UI sends those — the search pill's dates are static.)
  const fetcher = useCallback(
    () => getAccommodations({ location, guests, limit: 50 }),
    [location, guests]
  );
  const { data, loading, error, refetch } = useFetch(fetcher, [location, guests]);

  const accommodations = data?.accommodations || [];
  const total = data?.total ?? 0;

  /** "2 Airbnb Luxe stays in Sandton" / "2 Airbnb Luxe stays available" when unfiltered. */
  const heading = loading
    ? 'Searching stays…'
    : `${total} Airbnb Luxe stay${total === 1 ? '' : 's'}${location ? ` in ${location}` : ' available'}`;

  return (
    <div className="container page">
      <header className="results-header">
        <h1 className="results-header__title">{heading}</h1>

        <div className="results-filters" role="toolbar" aria-label="Filters">
          {FILTER_PILLS.map((pill) => (
            <button type="button" className="results-filters__pill" key={pill}>
              {pill}
            </button>
          ))}
        </div>
      </header>

      {loading && <Spinner label="Finding places to stay…" />}

      {!loading && error && (
        <ErrorMessage
          title="We couldn't load these stays"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Nothing matched — offer a way back to the full list */}
      {!loading && !error && accommodations.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state__title">No stays found</h2>
          <p className="empty-state__text">
            {location
              ? `We don't have any listings in ${location} right now. Try another destination.`
              : 'There are no listings in the database yet. Run the backend seed script to add some.'}
          </p>
          {location && (
            <Link to="/locations" className="btn btn--outline">
              View all stays
            </Link>
          )}
        </div>
      )}

      {!loading && !error && accommodations.length > 0 && (
        <div className="results-list">
          {accommodations.map((accommodation) => (
            <AccommodationCard key={accommodation._id} accommodation={accommodation} />
          ))}
        </div>
      )}
    </div>
  );
}
