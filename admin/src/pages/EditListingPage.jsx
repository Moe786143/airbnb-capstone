import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../components/listings/ListingForm';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import Alert from '../components/ui/Alert';
import { getAccommodation, updateAccommodation } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { fromAccommodation } from '../utils/listing';

/**
 * The edit listing page at `/listings/:id/edit`.
 *
 * Reuses the same Figma-matched form as the create page (see
 * ListingForm/ListingForm.css) — no separate Figma reference for this page
 * exists yet, so the heading/button wording here ("Edit Listing" /
 * "Update") is a placeholder to match, not a confirmed design value.
 *
 * Fetches the listing, pre-fills the form with the fields it collects, and
 * sends changes to PUT /api/accommodations/:id. Because that endpoint only
 * sets the keys it's given, fields this form doesn't show — price, guests,
 * rating, subtitle… — are left exactly as they were. On success it returns
 * to the listings page, which re-fetches on mount.
 *
 * Guards against editing someone else's listing: the backend would return
 * 403 anyway, but catching it here means a clear message instead of a
 * failed save after filling in the form.
 */
export default function EditListingPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const fetcher = useCallback(() => getAccommodation(id), [id]);
  const { data: listing, loading, error, refetch } = useFetch(fetcher, [id]);

  /** Send the validated payload to the API. */
  const handleSubmit = async (payload) => {
    setServerError(null);

    try {
      const updated = await updateAccommodation(id, payload, token);
      navigate('/', {
        replace: true,
        state: { flash: `"${updated.title}" has been updated.` },
      });
    } catch (err) {
      setServerError({ message: err.message, details: err.details });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="page page--narrow">
        <Spinner label="Loading this listing…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page--narrow">
        <ErrorState title="We couldn't load this listing" message={error} onRetry={refetch} />
        <p className="page__back">
          <Link to="/" className="btn btn--ghost">
            Back to listings
          </Link>
        </p>
      </div>
    );
  }

  if (!listing) return null;

  // The API allows anyone to read a listing, but only its owner to change
  // one — so say so plainly rather than letting the save fail later.
  if (String(listing.host_id) !== String(user._id)) {
    return (
      <div className="page page--narrow">
        <Alert tone="error" title="This isn't your listing">
          You can only edit listings you host. Head back to your own listings
          to make changes.
        </Alert>
        <p className="page__back">
          <Link to="/" className="btn btn--primary">
            Back to your listings
          </Link>
        </p>
      </div>
    );
  }

  return (
    <ListingForm
      heading="Edit Listing"
      initialValues={fromAccommodation(listing)}
      onSubmit={handleSubmit}
      submitLabel="Update"
      busyLabel="Saving…"
      serverError={serverError}
    />
  );
}
