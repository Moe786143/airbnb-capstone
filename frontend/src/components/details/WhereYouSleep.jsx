/**
 * "Where you'll sleep" — one card per bedroom.
 *
 * The API stores a bedroom count rather than a per-room breakdown, so the
 * bed description is inferred: a studio (0 bedrooms) gets a sofa bed, the
 * first bedroom a double, and any further bedrooms a pair of singles.
 *
 * @param {number} bedrooms
 */
export default function WhereYouSleep({ bedrooms = 0 }) {
  // A studio still needs somewhere to sleep, so show one card either way.
  const rooms =
    bedrooms > 0
      ? Array.from({ length: bedrooms }, (_, index) => ({
          name: `Bedroom ${index + 1}`,
          beds: index === 0 ? '1 double bed' : '2 single beds',
        }))
      : [{ name: 'Living area', beds: '1 sofa bed' }];

  return (
    <section className="detail-section">
      <h2 className="detail-section__title">Where you&apos;ll sleep</h2>

      <div className="sleep-grid">
        {rooms.map((room) => (
          <article className="sleep-card" key={room.name}>
            <span className="sleep-card__icon" aria-hidden="true">
              🛏️
            </span>
            <p className="sleep-card__name">{room.name}</p>
            <p className="sleep-card__beds">{room.beds}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
