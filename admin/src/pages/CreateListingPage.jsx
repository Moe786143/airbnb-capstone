import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListingForm from '../components/listings/ListingForm';
import { createAccommodation } from '../api/client';
import { useAuth } from '../context/AuthContext';

/**
 * The create listing page at `/listings/new`.
 *
 * Renders the shared form empty and posts the result to
 * POST /api/accommodations. On success it redirects to the listings page
 * with a confirmation message, so the host immediately sees the new listing
 * in context rather than being left on a form they have finished with.
 */
export default function CreateListingPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  /**
   * Send the validated payload to the API.
   * Throwing is avoided so the form can re-enable its submit button; the
   * error is rendered by the form instead.
   *
   * @param {object} payload - from the form's `toPayload()`
   */
  const handleSubmit = async (payload) => {
    setServerError(null);

    try {
      const created = await createAccommodation(payload, token);
      navigate('/', {
        replace: true,
        state: { flash: `"${created.title}" is now live on the customer site.` },
      });
    } catch (error) {
      setServerError({
        message: error.message,
        // The backend returns an `errors` array for validation failures.
        details: error.details,
      });
      // Bring the message into view — the form is long enough to scroll.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="page page--narrow">
      <header className="page__header">
        <div>
          <p className="page__breadcrumb">
            <Link to="/">Listings</Link> / New
          </p>
          <h1 className="page__title">Create a listing</h1>
          <p className="page__subtitle">
            Fill in the details below. Fields marked * are required.
          </p>
        </div>
      </header>

      <ListingForm
        onSubmit={handleSubmit}
        submitLabel="Publish listing"
        busyLabel="Publishing…"
        serverError={serverError}
      />
    </div>
  );
}
