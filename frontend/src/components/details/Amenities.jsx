/**
 * "What this place offers" — the listing's amenities in two columns.
 *
 * Each amenity gets an icon looked up by name, falling back to a generic
 * tick for anything not in the map, so a new amenity added on the backend
 * still renders sensibly.
 *
 * @param {string[]} amenities
 */

/** Amenity name -> emoji icon. */
const ICONS = {
  Wifi: '📶',
  Kitchen: '🍳',
  Washer: '🧺',
  Dryer: '🌀',
  Heating: '🔥',
  'Air conditioning': '❄️',
  'Dedicated workspace': '💻',
  'Free parking': '🚗',
  Pool: '🏊',
  'Hot tub': '🛁',
  Fireplace: '🪵',
  'Fire pit': '🔥',
  TV: '📺',
  'BBQ grill': '🍖',
  Patio: '🌿',
  Sauna: '🧖',
  'Ski-in/ski-out': '⛷️',
};

export default function Amenities({ amenities = [] }) {
  if (amenities.length === 0) {
    return (
      <section className="detail-section">
        <h2 className="detail-section__title">What this place offers</h2>
        <p className="muted">The host hasn&apos;t listed any amenities yet.</p>
      </section>
    );
  }

  return (
    <section className="detail-section">
      <h2 className="detail-section__title">What this place offers</h2>

      <ul className="amenities">
        {amenities.map((amenity) => (
          <li className="amenities__item" key={amenity}>
            <span className="amenities__icon" aria-hidden="true">
              {ICONS[amenity] || '✓'}
            </span>
            {amenity}
          </li>
        ))}
      </ul>

      <button type="button" className="btn btn--outline">
        Show all {amenities.length} amenities
      </button>
    </section>
  );
}
