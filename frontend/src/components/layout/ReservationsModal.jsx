import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';
import { deleteReservation, getUserReservations } from '../../api/client';
import { formatCurrency, formatDate, countNights } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

/**
 * "View reservations" dialog.
 *
 * Fetches GET /api/reservations/user and lists the logged-in guest's trips
 * in a table. Handles all four states: loading, error (with retry), empty,
 * and populated. Each row can be cancelled, which confirms first, calls
 * DELETE /api/reservations/:id, then refreshes the list.
 *
 * @param {boolean} open
 * @param {Function} onClose
 */
export default function ReservationsModal({ open, onClose }) {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // The reservation currently being deleted, so only its own row shows a
  // busy state rather than the whole table.
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  /**
   * Load the trips. Also used by the error state's retry button and by the
   * refresh after a cancellation.
   *
   * @param {object} [options]
   * @param {boolean} [options.silent=false] - skip the full-table spinner,
   *   used when refreshing after a delete so the table does not blank out
   */
  const load = useCallback(
    ({ silent = false } = {}) => {
      if (!token) return undefined;

      let cancelled = false;
      if (!silent) setLoading(true);
      setError(null);

      getUserReservations(token)
        .then((data) => {
          if (!cancelled) setReservations(data.reservations || []);
        })
        .catch((err) => {
          if (!cancelled) setError(err.message || 'Could not load your reservations.');
        })
        .finally(() => {
          if (!cancelled && !silent) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    },
    [token]
  );

  // Fetch fresh data every time the dialog opens, so a booking made moments
  // ago is already in the list. Any error from a previous visit is cleared.
  useEffect(() => {
    if (!open) return undefined;
    setCancelError(null);
    return load();
  }, [open, load]);

  /**
   * Cancel one reservation: confirm, delete, then reload the table.
   *
   * The confirmation is deliberately blocking — a cancellation cannot be
   * undone, and the backend has no "restore" endpoint.
   *
   * @param {object} reservation - the row being cancelled
   */
  const handleCancel = async (reservation) => {
    const stay = reservation.accommodation_id;
    const label = stay?.title ? `your stay at ${stay.title}` : 'this reservation';

    if (!window.confirm(`Cancel ${label}? This can't be undone.`)) return;

    setCancellingId(reservation._id);
    setCancelError(null);

    try {
      await deleteReservation(reservation._id, token);
      // Refresh from the server rather than removing the row locally, so the
      // table always reflects what the backend actually holds.
      load({ silent: true });
    } catch (err) {
      setCancelError(
        err.message || 'Could not cancel this reservation. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Your reservations" size="lg">
      {loading && <Spinner label="Loading your trips…" inline />}

      {!loading && error && <ErrorMessage message={error} onRetry={() => load()} />}

      {!loading && !error && reservations.length === 0 && (
        <div className="empty-state">
          <h3 className="empty-state__title">No trips booked… yet!</h3>
          <p className="empty-state__text">
            Time to dust off your bags and start planning your next adventure.
          </p>
          <Link to="/locations" className="btn btn--outline" onClick={onClose}>
            Start searching
          </Link>
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <>
          {/* A failed cancellation leaves the table intact — report it above */}
          {cancelError && (
            <p className="reservations-table__error" role="alert">
              {cancelError}
            </p>
          )}

          <div className="table-wrap">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th scope="col">Stay</th>
                  <th scope="col">Location</th>
                  <th scope="col">Check-in</th>
                  <th scope="col">Check-out</th>
                  <th scope="col">Nights</th>
                  <th scope="col">Guests</th>
                  <th scope="col" className="align-right">
                    Total
                  </th>
                  <th scope="col">
                    {/* Column of cancel buttons — the heading is for screen
                        readers only, the buttons label themselves visually */}
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  // accommodation_id is populated by the backend, but a listing
                  // deleted after booking would leave it null — guard for that.
                  const stay = reservation.accommodation_id;
                  const checkIn = reservation.checkIn?.slice(0, 10);
                  const checkOut = reservation.checkOut?.slice(0, 10);
                  const isCancelling = cancellingId === reservation._id;

                  return (
                    <tr key={reservation._id} className={isCancelling ? 'is-cancelling' : ''}>
                      <td>
                        {stay ? (
                          <Link
                            to={`/locations/${stay._id}`}
                            className="reservations-table__link"
                            onClick={onClose}
                          >
                            {stay.title}
                          </Link>
                        ) : (
                          <span className="muted">Listing no longer available</span>
                        )}
                      </td>
                      <td>{stay?.location || '—'}</td>
                      <td>{formatDate(checkIn, true)}</td>
                      <td>{formatDate(checkOut, true)}</td>
                      <td>{countNights(checkIn, checkOut)}</td>
                      <td>{reservation.guests}</td>
                      <td className="align-right">
                        <strong>{formatCurrency(reservation.totalCost)}</strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="reservations-table__cancel"
                          onClick={() => handleCancel(reservation)}
                          // Every button locks while one delete is in flight,
                          // so a second click cannot race the refresh.
                          disabled={cancellingId !== null}
                          aria-busy={isCancelling}
                        >
                          {isCancelling ? 'Cancelling…' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}
