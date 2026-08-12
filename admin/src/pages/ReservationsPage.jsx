import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { getHostReservations } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { countNights, formatCurrency, formatDate } from '../utils/format';

/**
 * The reservations page at `/reservations`.
 *
 * Lists every booking made against this host's listings, newest first, from
 * GET /api/reservations/host. The backend populates the guest and the
 * listing, so the table needs no further requests.
 */
export default function ReservationsPage() {
  const { token } = useAuth();

  const fetcher = useCallback(() => getHostReservations(token), [token]);
  const { data, loading, error, refetch } = useFetch(fetcher, [token]);

  const reservations = data?.reservations || [];

  // Total booked value across every reservation, for the header summary.
  const totalEarnings = reservations.reduce(
    (sum, reservation) => sum + (reservation.totalCost || 0),
    0
  );

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Reservations</h1>
          <p className="page__subtitle">
            {loading
              ? 'Loading your bookings…'
              : `${reservations.length} booking${reservations.length === 1 ? '' : 's'}` +
                (reservations.length > 0
                  ? ` · ${formatCurrency(totalEarnings)} booked`
                  : '')}
          </p>
        </div>
      </header>

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
          <Link to="/" className="btn btn--outline">
            Back to your listings
          </Link>
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Guest</th>
                <th scope="col">Listing</th>
                <th scope="col">Check-in</th>
                <th scope="col">Check-out</th>
                <th scope="col">Nights</th>
                <th scope="col">Guests</th>
                <th scope="col" className="align-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                // Both refs are populated by the backend, but a listing or
                // account deleted after booking would leave them null.
                const guest = reservation.user_id;
                const stay = reservation.accommodation_id;
                const checkIn = reservation.checkIn;
                const checkOut = reservation.checkOut;

                return (
                  <tr key={reservation._id}>
                    <td>
                      <span className="data-table__guest">
                        <span className="data-table__avatar" aria-hidden="true">
                          {guest?.username?.charAt(0).toUpperCase() || '?'}
                        </span>
                        {guest?.username || <span className="muted">Deleted account</span>}
                      </span>
                    </td>
                    <td>
                      {stay ? (
                        <Link to={`/listings/${stay._id}/edit`} className="data-table__link">
                          {stay.title}
                        </Link>
                      ) : (
                        <span className="muted">Listing removed</span>
                      )}
                      {stay?.location && (
                        <span className="data-table__sub">{stay.location}</span>
                      )}
                    </td>
                    <td>{formatDate(checkIn)}</td>
                    <td>{formatDate(checkOut)}</td>
                    <td>{countNights(checkIn, checkOut)}</td>
                    <td>{reservation.guests}</td>
                    <td className="align-right">
                      <strong>{formatCurrency(reservation.totalCost)}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
