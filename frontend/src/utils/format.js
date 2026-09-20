/**
 * Shared formatting and pricing helpers.
 *
 * The pricing maths here deliberately mirrors the backend's
 * `calculateTotalCost` exactly, so the breakdown a guest sees before booking
 * always matches the `totalCost` the server stores afterwards.
 */

/** One day in milliseconds — used to turn a date range into a night count. */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Format a number as US dollars with no decimal places (Airbnb's own style).
 * @param {number} amount
 * @returns {string} e.g. "$1,156"
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);

/**
 * Format an ISO date string for display.
 * @param {string} isoDate - e.g. "2026-09-01"
 * @param {boolean} [withYear=false]
 * @returns {string} e.g. "Sep 1" or "Sep 1, 2026"
 */
export const formatDate = (isoDate, withYear = false) => {
  if (!isoDate) return '';
  // Append midday UTC so the date is not shifted a day by the local timezone.
  const date = new Date(`${isoDate.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  });
};

/** Format an ISO date as a full readable date, e.g. "September 1, 2026". */
export const formatLongDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(`${String(isoDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/** Turn a Date into the `YYYY-MM-DD` string an <input type="date"> expects. */
export const toInputDate = (date) => {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

/** Today as `YYYY-MM-DD`, used as the `min` on the check-in picker. */
export const today = () => toInputDate(new Date());

/**
 * Number of nights between two ISO dates. Returns 0 for a missing or
 * backwards range so callers never have to guard against negatives.
 */
export const countNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const nights = Math.round((end - start) / MS_PER_DAY);
  return nights > 0 ? nights : 0;
};

// Guests beyond this many cost extra — mirrors the backend's
// BASE_INCLUDED_GUESTS in reservationController.js. Keep the two in sync.
const BASE_INCLUDED_GUESTS = 2;
const EXTRA_GUEST_FEE_PER_NIGHT = 15;
const EXTRA_GUEST_CLEANING_FEE = 10;

/**
 * Work out the full cost breakdown for a stay.
 *
 * Mirrors the backend formula:
 *   (price x nights) + extra-guest fee - weekly discount + cleaning +
 *   service + taxes
 * where the weekly discount is a percentage that only applies to stays of
 * 7 nights or more, and the extra-guest fee/cleaning bump only apply once
 * the party is bigger than BASE_INCLUDED_GUESTS — more guests means more
 * rooms to turn over and more wear on the place, so the price moves with
 * the guest count, not just the date range.
 *
 * @param {object} accommodation - the listing being priced
 * @param {number} nights
 * @param {number} [guests=1]
 * @returns {{nights, nightlySubtotal, extraGuests, extraGuestFee, discount, cleaningFee, serviceFee, occupancyTaxes, total}}
 */
export const calculateBreakdown = (accommodation, nights, guests = 1) => {
  const price = accommodation?.price || 0;
  const nightlySubtotal = price * nights;

  const extraGuests = Math.max(0, (guests || 1) - BASE_INCLUDED_GUESTS);
  const extraGuestFee = extraGuests * EXTRA_GUEST_FEE_PER_NIGHT * nights;

  const discount =
    nights >= 7 && accommodation?.weeklyDiscount
      ? nightlySubtotal * (accommodation.weeklyDiscount / 100)
      : 0;

  const cleaningFee = (accommodation?.cleaningFee || 0) + extraGuests * EXTRA_GUEST_CLEANING_FEE;
  const serviceFee = accommodation?.serviceFee || 0;
  const occupancyTaxes = accommodation?.occupancyTaxes || 0;

  const total =
    Math.round(
      (nightlySubtotal +
        extraGuestFee -
        discount +
        cleaningFee +
        serviceFee +
        occupancyTaxes) *
        100
    ) / 100;

  return {
    nights,
    price,
    nightlySubtotal,
    extraGuests,
    extraGuestFee,
    discount,
    cleaningFee,
    serviceFee,
    occupancyTaxes,
    // A zero-night range has no cost at all, fees included.
    total: nights > 0 ? total : 0,
  };
};

/**
 * Round a rating to one decimal for display, e.g. 4.92 -> "4.92" stays
 * meaningful but 5 -> "5.0" reads better next to a star.
 */
export const formatRating = (rating) => (Number(rating) || 0).toFixed(2);
