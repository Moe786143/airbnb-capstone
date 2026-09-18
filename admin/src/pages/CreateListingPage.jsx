import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/listings/ListingForm';
import { createAccommodation } from '../api/client';
import { useAuth } from '../context/AuthContext';

/**
 * The create listing page at `/listings/new` — matches the Figma
 * "Create Listing" frame exactly (see ListingForm/ListingForm.css).
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
    <ListingForm
      heading="Create Listing"
      onSubmit={handleSubmit}
      submitLabel="Create"
      busyLabel="Creating…"
      serverError={serverError}
    />
  );
}
