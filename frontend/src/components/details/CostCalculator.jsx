import { useMemo, useState } from 'react';
import StarIcon from '../ui/StarIcon';
import { useAuth } from '../../context/AuthContext';
import { createReservation } from '../../api/client';
import {
  calculateBreakdown,
  countNights,
  formatCurrency,
  formatRating,
  today,
} from '../../utils/format';

/**
 * The sticky booking card in the right column of the details page.
 *
 * Owns the whole booking interaction:
 *  - check-in / check-out date pickers and a guest selector
 *  - a live cost breakdown that recalculates on every change, using the
 *    same formula as the backend so the total shown always matches the
 *    total the server stores
 *  - a Reserve button that POSTs to /api/reservations with the JWT
 *  - success and error feedback, including the 409 you get when the dates
 *    are already taken
 *  - a "log in to book" prompt when there is no session
 *
 * The dates and guest count are lifted to the page so the "N nights in
 * <location>" section can display the same range.
 *
 * @param {object} accommodation - the listing being booked
 * @param {string} checkIn - ISO date, controlled by the page
 * @param {string} checkOut - ISO date, controlled by the page
 * @param {number} guests
 * @param {Function} onChange - ({ checkIn, checkOut, guests }) => void
 */
export default function CostCalculator({
  accommodation,
  checkIn,
  checkOut,
  guests,
  onChange,
}) {
  const { isAuthenticated, token, openLogin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const nights = countNights(checkIn, checkOut);

  // Recomputed whenever the dates or guest count change — this is what
  // makes the breakdown "live". Guests beyond the first two add their own
  // fee and a cleaning-fee bump, so the total moves with the party size,
  // not just the date range. useMemo keeps it from recalculating on
  // unrelated re-renders.
  const breakdown = useMemo(
    () => calculateBreakdown(accommodation, nights, guests),
    [accommodation, nights, guests]
  );

  /**
   * Local validation, mirroring the backend's rules so the user gets
   * immediate feedback instead of a round-trip to find out the dates are
   * backwards.
   *
   * @returns {string|null} the problem, or null when the form is bookable
   */
  const validationError = useMemo(() => {
    if (!checkIn || !checkOut) return 'Add your travel dates to see the total price.';
    if (nights <= 0) return 'Your check-out date must be after your check-in date.';
    if (guests > accommodation.guests) {
      return `This place has a maximum of ${accommodation.guests} guests.`;
    }
    return null;
  }, [checkIn, checkOut, nights, guests, accommodation.guests]);

  /** Update one field and clear any stale success/error feedback. */
  const update = (patch) => {
    setSuccess(null);
    setError(null);
    onChange(patch);
  };

  /**
   * When the check-in date moves past the check-out date, push check-out
   * along with it rather than leaving the form in an invalid state.
   */
  const handleCheckInChange = (value) => {
    if (checkOut && value >= checkOut) {
      const nextDay = new Date(`${value}T12:00:00`);
      nextDay.setDate(nextDay.getDate() + 1);
      update({ checkIn: value, checkOut: nextDay.toISOString().split('T')[0] });
      return;
    }
    update({ checkIn: value });
  };

  /**
   * POST the booking, then report success or the server's error message.
   * Reserve stays a single button in both states (matching Figma) — when
   * there's no session, clicking it opens the login dialog instead of
   * submitting, rather than swapping to a separate "log in" label.
   */
  const handleReserve = async () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const reservation = await createReservation(
        {
          accommodation_id: accommodation._id,
          checkIn,
          checkOut,
          guests,
        },
        token
      );

      setSuccess(
        `Booked! ${nights} night${nights === 1 ? '' : 's'} for ${formatCurrency(
          reservation.totalCost
        )}. Find it under "View reservations".`
      );
    } catch (err) {
      // The backend returns 409 for a clash, 400 for bad input, 401 for an
      // expired token — its message is always the clearest thing to show.
      setError(err.message || 'Could not complete your reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="booking-card">
      <div className="booking-card__header">
        <p className="booking-card__price">
          <strong>{formatCurrency(accommodation.price)}</strong>
          <span className="booking-card__per-night"> night</span>
        </p>
        <p className="booking-card__rating">
          <StarIcon />
          <strong>{formatRating(accommodation.rating)}</strong>
          <span className="booking-card__reviews">· {accommodation.reviews} reviews</span>
        </p>
      </div>

      {/* Date + guest inputs, grouped in one bordered block like Airbnb's */}
      <div className="booking-fields">
        <div className="booking-fields__row">
          <label className="booking-field">
            <span className="booking-field__label">Check-in</span>
            <input
              type="date"
              className="booking-field__input"
              value={checkIn}
              min={today()}
              onChange={(event) => handleCheckInChange(event.target.value)}
            />
          </label>
          <label className="booking-field">
            <span className="booking-field__label">Check-out</span>
            <input
              type="date"
              className="booking-field__input"
              value={checkOut}
              // Never allow a check-out on or before the check-in date.
              min={checkIn || today()}
              onChange={(event) => update({ checkOut: event.target.value })}
            />
          </label>
        </div>

        <label className="booking-field booking-field--full">
          <span className="booking-field__label">Guests</span>
          <select
            className="booking-field__input booking-field__input--select"
            value={guests}
            onChange={(event) => update({ guests: Number(event.target.value) })}
          >
            {/* Capped at the listing's own capacity, so the invalid case
                cannot normally be reached from the UI at all */}
            {Array.from({ length: accommodation.guests }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {count} guest{count === 1 ? '' : 's'}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      {/* Reserve — always the same button and label. Signed out, clicking
          it opens the login dialog (the "you need to log in" prompt)
          instead of submitting; signed in, it submits the booking. */}
      <button
        type="button"
        className="btn btn--primary btn--block booking-card__reserve"
        onClick={handleReserve}
        disabled={submitting || (isAuthenticated && Boolean(validationError))}
      >
        {submitting ? 'Reserving…' : 'Reserve'}
      </button>

      {!error && !success && (
        <p className="booking-card__note">You won&apos;t be charged yet</p>
      )}

      {/* Feedback: local validation, server error, or a confirmed booking */}
      {validationError && !success && (
        <p className="booking-card__hint">{validationError}</p>
      )}

      {error && (
        <p className="booking-card__error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="booking-card__success" role="status">
          {success}
        </p>
      )}

      {/* The live breakdown — only meaningful once there is a date range */}
      {nights > 0 && (
        <div className="breakdown">
          <div className="breakdown__row">
            <span className="breakdown__label breakdown__label--underline">
              {formatCurrency(breakdown.price)} &times; {nights} night
              {nights === 1 ? '' : 's'}
            </span>
            <span>{formatCurrency(breakdown.nightlySubtotal)}</span>
          </div>

          {/* Only shown when it actually applies: 7+ nights on a listing
              that offers a weekly discount */}
          {breakdown.discount > 0 && (
            <div className="breakdown__row breakdown__row--discount">
              <span className="breakdown__label breakdown__label--underline">
                Weekly discount ({accommodation.weeklyDiscount}%)
              </span>
              <span>-{formatCurrency(breakdown.discount)}</span>
            </div>
          )}

          {/* Only shown once the party is bigger than the two guests
              already covered by the nightly rate. */}
          {breakdown.extraGuestFee > 0 && (
            <div className="breakdown__row">
              <span className="breakdown__label breakdown__label--underline">
                Extra guest fee &middot; {breakdown.extraGuests} extra guest
                {breakdown.extraGuests === 1 ? '' : 's'}
              </span>
              <span>{formatCurrency(breakdown.extraGuestFee)}</span>
            </div>
          )}

          <div className="breakdown__row">
            <span className="breakdown__label breakdown__label--underline">Cleaning fee</span>
            <span>{formatCurrency(breakdown.cleaningFee)}</span>
          </div>

          <div className="breakdown__row">
            <span className="breakdown__label breakdown__label--underline">Service fee</span>
            <span>{formatCurrency(breakdown.serviceFee)}</span>
          </div>

          <div className="breakdown__row">
            <span className="breakdown__label breakdown__label--underline">
              Occupancy taxes and fees
            </span>
            <span>{formatCurrency(breakdown.occupancyTaxes)}</span>
          </div>

          <div className="breakdown__total">
            <span>Total</span>
            <span>{formatCurrency(breakdown.total)}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
