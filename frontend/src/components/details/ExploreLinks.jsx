/**
 * "Explore other options in France" — the static related-links panel that
 * sits between the listing's content and the site footer (Figma's own
 * "Airbnb Footer" grouping, distinct from the 4-column Support/Community
 * footer that's already shared across every page).
 *
 * Every link is a real, hoverable button, but none of them lead anywhere
 * — same "clickable but goes nowhere" treatment as the rest of the app's
 * decoration. The city list, rental-type list, and breadcrumb are copied
 * from Figma exactly rather than derived from the listing, since the app
 * only has two real destinations to search.
 */
const EXPLORE_CITIES = [
  'Paris',
  'Nice',
  'Lyon',
  'Marseille',
  'Lille',
  'Aix-en-Provence',
  'Rouen',
  'Amiens',
  'Toulouse',
  'Montpellier',
  'Dijon',
  'Grenoble',
];

const UNIQUE_STAYS = [
  'Beach House Rentals',
  'Camper Rentals',
  'Glamping Rentals',
  'Treehouse Rentals',
  'Cabin Rentals',
  'Tiny House Rentals',
  'Lakehouse Rentals',
  'Mountain Chalet Rentals',
];

const BREADCRUMB = ['Airbnb', 'Europe', 'France', 'Bordeaux'];

export default function ExploreLinks() {
  return (
    <section className="detail-section explore-links">
      <h2 className="explore-links__title">Explore other options in France</h2>
      <div className="explore-links__grid">
        {EXPLORE_CITIES.map((city) => (
          <button type="button" className="explore-links__item" key={city}>
            {city}
          </button>
        ))}
      </div>

      <h3 className="explore-links__title">Unique stays on Airbnb</h3>
      <div className="explore-links__grid">
        {UNIQUE_STAYS.map((stay) => (
          <button type="button" className="explore-links__item" key={stay}>
            {stay}
          </button>
        ))}
      </div>

      <nav className="explore-links__breadcrumb" aria-label="Breadcrumb">
        {BREADCRUMB.map((crumb, index) => (
          <span className="explore-links__crumb-wrap" key={crumb}>
            {index > 0 && (
              <svg
                className="explore-links__chevron"
                viewBox="0 0 16 16"
                width="12"
                height="12"
                aria-hidden="true"
              >
                <path
                  d="M6 3l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <button type="button" className="explore-links__crumb">
              {crumb}
            </button>
          </span>
        ))}
      </nav>
    </section>
  );
}
