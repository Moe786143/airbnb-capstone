/**
 * "Things to know" — the three static policy columns at the foot of the
 * details page: house rules, health & safety, and the cancellation policy.
 *
 * Figma shows this as fixed policy copy (not derived per listing), so it's
 * rendered literally here rather than built from accommodation fields.
 */
export default function ThingsToKnow() {
  return (
    <section className="detail-section detail-section--last">
      <h2 className="detail-section__title">Things to know</h2>

      <div className="know-grid">
        <div className="know-column">
          <h3 className="know-column__title">House rules</h3>
          <ul className="know-column__list">
            <li>Check-in: After 4:00 PM</li>
            <li>Checkout: 10:00 AM</li>
            <li>Self check-in with lockbox</li>
            <li>Not suitable for infants (under 2 years)</li>
            <li>No smoking</li>
            <li>No pets</li>
            <li>No parties or events</li>
          </ul>
        </div>

        <div className="know-column">
          <h3 className="know-column__title">Health &amp; safety</h3>
          <ul className="know-column__list">
            <li>
              Committed to Airbnb&apos;s enhanced cleaning process.{' '}
              <button type="button" className="link-button link-button--inline">
                Show more
              </button>
            </li>
            <li>Airbnb&apos;s social-distancing and other COVID-19-related guidelines apply</li>
            <li>Carbon monoxide alarm</li>
            <li>Smoke alarm</li>
            <li>Security deposit — up to $566 if you damage the home</li>
          </ul>
        </div>

        <div className="know-column">
          <h3 className="know-column__title">Cancellation policy</h3>
          <p className="know-column__muted">Free cancellation before Feb 14</p>
          <button type="button" className="link-button link-button--chevron">
            Show more
            <svg
              className="know-column__chevron"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
