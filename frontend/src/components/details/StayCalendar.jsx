import { formatLongDate } from '../../utils/format';

/**
 * The "<N> nights in <location>" band above the reviews.
 *
 * Reads the same dates the cost calculator is using — they are held by the
 * page and passed to both — so changing a date in the booking card updates
 * this heading too.
 *
 * @param {number} nights
 * @param {string} location
 * @param {string} checkIn - ISO date
 * @param {string} checkOut - ISO date
 */
export default function StayCalendar({ nights, location, checkIn, checkOut }) {
  // Strip the country so the heading reads "7 nights in Paris".
  const city = location?.split(',')[0] || location;

  return (
    <section className="detail-section">
      <h2 className="detail-section__title">
        {nights > 0 ? `${nights} night${nights === 1 ? '' : 's'} in ${city}` : `Your stay in ${city}`}
      </h2>

      <p className="stay-dates">
        {checkIn && checkOut && nights > 0
          ? `${formatLongDate(checkIn)} — ${formatLongDate(checkOut)}`
          : 'Choose your dates in the booking panel to see your stay.'}
      </p>

      {/* A simple visual stand-in for Airbnb's two-month availability
          calendar — the real date selection happens in the booking card. */}
      <div className="stay-strip" aria-hidden="true">
        <div className="stay-strip__bar">
          <span className="stay-strip__marker stay-strip__marker--in">Check-in</span>
          <span className="stay-strip__line" />
          <span className="stay-strip__marker stay-strip__marker--out">Check-out</span>
        </div>
      </div>
    </section>
  );
}
