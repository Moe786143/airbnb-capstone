import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ListingCard from '../components/listings/ListingCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { deleteAccommodation, getAccommodations } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './ListingsPage.css';


/**
 * The dashboard home at `/` — "My Hotel List", every listing this host owns.
 *
 * The API has no "only mine" filter, so this fetches a full page of
 * accommodations and narrows to the ones whose `host_id` matches the
 * logged-in host. Deleting asks for confirmation, calls
 * DELETE /api/accommodations/:id, then reloads the list from the server.
 */
export default function ListingsPage() {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The listing awaiting confirmation, and the delete's progress/outcome.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // A success message handed over by the create/edit pages on redirect.
  const [flash, setFlash] = useState(location.state?.flash || null);

  // Drop the flash from history so a refresh does not show it again.
  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  /**
   * Load this host's listings.
   *
   * @param {object} [options]
   * @param {boolean} [options.silent=false] - skip the full-page spinner,
   *   used when refreshing after a delete so the grid does not blank out
   */
  const load = useCallback(
    ({ silent = false } = {}) => {
      if (!token || !user) return undefined;

      let cancelled = false;
      if (!silent) setLoading(true);
      setError(null);

      // limit=100 is the API's maximum page size — comfortably more than a
      // demo host's portfolio, and avoids paging logic on the dashboard.
      getAccommodations({ limit: 100 })
        .then((data) => {
          if (cancelled) return;
          const mine = (data.accommodations || []).filter(
            (listing) => String(listing.host_id) === String(user._id)
          );
          setListings(mine);
        })
        .catch((err) => {
          if (!cancelled) setError(err.message || 'Could not load your listings.');
        })
        .finally(() => {
          if (!cancelled && !silent) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    },
    [token, user]
  );

  useEffect(() => load(), [load]);

  /** Run the delete the dialog just confirmed. */
  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    setDeletingId(pendingDelete._id);
    setActionError(null);

    try {
      await deleteAccommodation(pendingDelete._id, token);
      setFlash(`"${pendingDelete.title}" has been deleted.`);
      setPendingDelete(null);
      // Refresh from the server so the grid matches what the backend holds.
      load({ silent: true });
    } catch (err) {
      setActionError(
        err.message || 'Could not delete that listing. Please try again.'
      );
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="listings-content">
      <h2 className="listings-content__heading">My Hotel List</h2>
      <div className="listings-content__divider" />

      {/* Feedback from a create, update or delete */}
      {flash && (
        <Alert tone="success" onDismiss={() => setFlash(null)}>
          {flash}
        </Alert>
      )}

      {actionError && (
        <Alert tone="error" title="Delete failed" onDismiss={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {loading && <Spinner label="Loading your listings…" />}

      {!loading && error && <ErrorState message={error} onRetry={() => load()} />}

      {!loading && !error && listings.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state__title">No listings yet</h2>
          <p className="empty-state__text">
            Create your first listing and it will appear here, and on the
            customer site straight away.
          </p>
          <Link to="/listings/new" className="btn btn--primary">
            Create your first listing
          </Link>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="listing-rows">
          {listings.map((listing) => (
            <div className="listing-rows__item" key={listing._id}>
              <ListingCard listing={listing} />

              <Link
                to={`/listings/${listing._id}/edit`}
                className="listing-row__btn listing-row__btn--update"
              >
                Update
              </Link>

              <button
                type="button"
                className="listing-row__btn listing-row__btn--delete"
                onClick={() => setPendingDelete(listing)}
                disabled={deletingId === listing._id}
              >
                {deletingId === listing._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this listing?"
        busy={Boolean(deletingId)}
        confirmLabel="Delete listing"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <p>
          <strong>{pendingDelete?.title}</strong> will be permanently removed
          and will no longer appear on the customer site.
        </p>
        <p className="confirm__warning">This cannot be undone.</p>
      </ConfirmDialog>
    </div>
  );
}
