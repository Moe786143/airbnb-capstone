/**
 * Display formatting helpers shared across the dashboard.
 */

/** Format a number as US dollars, e.g. 1114.4 -> "$1,114". */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(Number(amount)) ? Number(amount) : 0);

/**
 * Format an ISO date for a table cell, e.g. "1 Sep 2027".
 * Midday is appended so the local timezone cannot shift the date by a day.
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(`${String(isoDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/** Nights between two ISO dates; 0 for a missing or backwards range. */
export const countNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${String(checkIn).slice(0, 10)}T12:00:00`);
  const end = new Date(`${String(checkOut).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};
