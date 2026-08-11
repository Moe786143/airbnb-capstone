import StarIcon from '../ui/StarIcon';
import { formatRating } from '../../utils/format';

/**
 * The reviews block: the overall score and count, then a bar for each of
 * the six category ratings the API stores in `specificRatings`.
 *
 * @param {number} rating - the overall average
 * @param {number} reviews - total number of reviews
 * @param {object} specificRatings - { cleanliness, communication, checkIn,
 *   accuracy, location, value }
 */

/** Field name -> human label, in the order Airbnb shows them. */
const CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'communication', label: 'Communication' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'location', label: 'Location' },
  { key: 'value', label: 'Value' },
];

export default function Reviews({ rating, reviews, specificRatings = {} }) {
  return (
    <section className="detail-section">
      <h2 className="detail-section__title detail-section__title--inline">
        <StarIcon size={18} />
        <span>
          {formatRating(rating)} &middot; {reviews} reviews
        </span>
      </h2>

      <div className="rating-bars">
        {CATEGORIES.map(({ key, label }) => {
          const score = Number(specificRatings?.[key]) || 0;
          // Ratings are out of 5, so the bar width is score/5 as a percentage.
          const percent = Math.max(0, Math.min(100, (score / 5) * 100));

          return (
            <div className="rating-bar" key={key}>
              <span className="rating-bar__label">{label}</span>
              <span className="rating-bar__track">
                <span className="rating-bar__fill" style={{ width: `${percent}%` }} />
              </span>
              <span className="rating-bar__value">{score.toFixed(1)}</span>
            </div>
          );
        })}
      </div>

      <button type="button" className="btn btn--outline">
        Show all {reviews} reviews
      </button>
    </section>
  );
}
