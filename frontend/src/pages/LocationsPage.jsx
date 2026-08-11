import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LocationFilter from '../components/locations/LocationFilter';
import AccommodationCard from '../components/locations/AccommodationCard';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getAccommodations } from '../api/client';
import { useFetch } from '../hooks/useFetch';

/**
 * The search results page at `/locations`.
 *
 * The destination lives in the URL query string (`?location=Paris`), which
 * makes results shareable and bookmarkable and lets the home page's
 * destination cards link straight into a filtered view. Changing the
 * dropdown rewrites the query string, which re-runs the fetch.
 */
export default function LocationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get('location') || '';

  // Re-fetches whenever the location in the URL changes.
  const fetcher = useCallback(() => getAccommodations({ location, limit: 50 }), [location]);
  const { data, loading, error, refetch } = useFetch(fetcher, [location]);

  /** Write the new destination into the URL (or clear it for "Anywhere"). */
  const handleLocationChange = (value) => {
    setSearchParams(value ? { location: value } : {});
  };

  const accommodations = data?.accommodations || [];
  const total = data?.total ?? 0;

  /** "12 stays in Paris" / "12 stays available" when unfiltered. */
  const heading = loading
    ? 'Searching stays…'
    : `${total} stay${total === 1 ? '' : 's'}${location ? ` in ${location}` : ' available'}`;

  return (
    <div className="container page">
      <header className="results-header">
        <div>
          <h1 className="results-header__title">{heading}</h1>
          <p className="results-header__subtitle">
            {location
              ? `Places to stay in and around ${location}`
              : 'Browse every destination we currently host'}
          </p>
        </div>

        <LocationFilter value={location} onChange={handleLocationChange} />
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
