/**
 * "Things to know" — the three static policy columns at the foot of the
 * details page: house rules, health & safety, and the cancellation policy.
 *
 * Check-in and check-out times reflect whether the listing offers self
 * check-in; everything else is the same standard policy text for every
 * listing, which is how Airbnb presents it too.
 *
 * @param {boolean} selfCheckIn
 * @param {boolean} enhancedCleaning
 * @param {number} guests - maximum occupancy, quoted in the house rules
 */
export default function ThingsToKnow({ selfCheckIn, enhancedCleaning, guests }) {
  const columns = [
    {
      title: 'House rules',
      items: [
        selfCheckIn ? 'Check-in: anytime after 3:00 pm' : 'Check-in: 3:00 pm — 8:00 pm',
        'Check-out before 11:00 am',
        `${guests} guests maximum`,
        'No parties or events',
        'No smoking',
      ],
    },
    {
      title: 'Health & safety',
      items: [
        enhancedCleaning
          ? "Committed to Airbnb's enhanced cleaning process"
          : 'Standard cleaning between stays',
        "Airbnb's social-distancing and other COVID-19-related guidelines apply",
        'Carbon monoxide alarm',
        'Smoke alarm',
        'Security deposit — if you damage the home, you may be charged',
      ],
    },
    {
      title: 'Cancellation policy',
      items: [
        'Free cancellation for 48 hours',
        'Review the full policy before booking',
        'Cancel before check-in for a partial refund',
        'Refunds are processed within 10 days',
      ],
    },
  ];

  return (
    <section className="detail-section detail-section--last">
      <h2 className="detail-section__title">Things to know</h2>

      <div className="know-grid">
        {columns.map((column) => (
          <div className="know-column" key={column.title}>
            <h3 className="know-column__title">{column.title}</h3>
            <ul className="know-column__list">
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="link-button">
              Show more
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
