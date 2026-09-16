import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { getHostReservations } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import './ReservationsPage.css';

/**
 * Format an ISO date as DD/MM/YYYY, matching the Figma reservations table.
 * Local to this page — the shared `formatDate` util uses a different
 * ("1 Sep 2027") style used elsewhere.
 */
const formatShortDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(`${String(isoDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '—';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export default function ReservationsPage() {
  const { token } = useAuth();

  const fetcher = useCallback(() => getHostReservations(token), [token]);
  const { data, loading, error, refetch } = useFetch(fetcher, [token]);

  const reservations = data?.reservations || [];

  return (
    <div className="reservations-content">
      <h2>My Reservations</h2>

      {loading && <Spinner label="Loading your bookings…" />}

      {!loading && error && (
        <ErrorState title="We couldn't load your reservations" message={error} onRetry={refetch} />
      )}

      {!loading && !error && reservations.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state__title">No bookings yet</h2>
          <p className="empty-state__text">
            When a guest books one of your listings, it will show up here with
            their dates and what they paid.
          </p>
          <Link to="/" className="btn btn--outline">Back to your listings</Link>
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Booked by</th>
              <th>Property</th>
              <th>Checkin</th>
              <th>Checkout</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              const guest = reservation.user_id;
              const stay = reservation.accommodation_id;
              const checkIn = reservation.checkIn;
              const checkOut = reservation.checkOut;

              return (
                <tr key={reservation._id}>
                  <td>
                    {guest?.username || <span className="reservations-muted">Deleted account</span>}
                  </td>
                  <td>
                    {stay ? (
                      <Link to={`/listings/${stay._id}/edit`} className="reservations-table__link">
                        {stay.title}
                      </Link>
                    ) : (
                      <span className="reservations-muted">Listing removed</span>
                    )}
                  </td>
                  <td>{formatShortDate(checkIn)}</td>
                  <td>{formatShortDate(checkOut)}</td>
                  <td>
                    {/* Visual only for now — no deleteReservation endpoint yet.
                        Wire this up later if real cancel functionality is added. */}
                    <button className="delete-btn" disabled title="Cancel functionality coming soon">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
