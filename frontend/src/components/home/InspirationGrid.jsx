import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';
import { LOCATIONS } from '../../data/locations';

/**
 * "Inspiration for your next trip" — the grid of the eight featured
 * destinations.
 *
 * Each card links to /locations?location=<name>, which the locations page
 * reads from the query string to filter its results.
 */
export default function InspirationGrid() {
  return (
    <section className="section container">
      <h2 className="section__title">Inspiration for your next trip</h2>

      <div className="inspiration-grid">
        {LOCATIONS.map((location) => (
          <Link
            key={location.name}
            to={`/locations?location=${encodeURIComponent(location.name)}`}
            className="inspiration-card"
          >
            <SafeImage
              src={location.image}
              alt={`${location.name}, ${location.region}`}
              className="inspiration-card__image"
            />
            <div className="inspiration-card__text">
              <span className="inspiration-card__name">{location.name}</span>
              <span className="inspiration-card__distance">{location.distance}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
