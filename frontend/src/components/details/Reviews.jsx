import StarIcon from '../ui/StarIcon';
import { API_URL } from '../../api/client';

const IMAGE_BASE = API_URL.replace(/\/api$/, '');

/**
 * The two rating-bar columns, in the order Figma shows them. Fixed values
 * matching the design, not driven by accommodation.specificRatings —
 * Figma shows one fixed "5.0 · 7 reviews" review block, the same on every
 * listing, not a per-listing breakdown.
 */
const RATINGS_LEFT = [
  { label: 'Cleanliness', score: 5.0 },
  { label: 'Communication', score: 5.0 },
  { label: 'Check-in', score: 5.0 },
];
const RATINGS_RIGHT = [
  { label: 'Accuracy', score: 5.0 },
  { label: 'Location', score: 4.9 },
  { label: 'Value', score: 4.7 },
];

/**
 * The six review cards, in the order Figma shows them (left column then
 * right column, row by row). Photos are the ones you sent for each
 * reviewer, served from backend/public/images/ the same way the seeded
 * listing photos are.
 */
const REVIEWS = [
  {
    name: 'Jose',
    date: 'December 2021',
    avatar: 'review-jose.png',
    text: 'Host was very attentive.',
  },
  {
    name: 'Luke',
    date: 'December 2021',
    avatar: 'review-luke.png',
    text: 'Nice place to stay!',
  },
  {
    name: 'Shayna',
    date: 'December 2021',
    avatar: 'review-shayna.png',
    text: 'Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive. Cool murphy bed…',
    truncated: true,
  },
  {
    name: 'Josh',
    date: 'November 2021',
    avatar: 'review-josh.png',
    text: 'Well designed and fun space, neighborhood has lots of energy and amenities.',
  },
  {
    name: 'Vladko',
    date: 'November 2020',
    avatar: 'review-vladko.png',
    text: 'This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality affordable price.',
  },
  {
    name: 'Jennifer',
    date: 'January 2022',
    avatar: 'review-jennifer.png',
    text: 'A centric place, near of a sub station and a supermarket with everything you need. …',
    truncated: true,
  },
];

function RatingBar({ label, score }) {
  const percent = Math.max(0, Math.min(100, (score / 5) * 100));

  return (
    <div className="rating-bar">
      <span className="rating-bar__label">{label}</span>
      <span className="rating-bar__track">
        <span className="rating-bar__fill" style={{ width: `${percent}%` }} />
      </span>
      <span className="rating-bar__value">{score.toFixed(1)}</span>
    </div>
  );
}

function ReviewCard({ name, date, avatar, text, truncated }) {
  return (
    <article className="review-card">
      <div className="review-card__header">
        <img
          src={`${IMAGE_BASE}/images/${avatar}`}
          alt=""
          className="review-card__avatar"
        />
        <div className="review-card__identity">
          <p className="review-card__name">{name}</p>
          <p className="review-card__date">{date}</p>
        </div>
      </div>

      <p className="review-card__text">{text}</p>

      {truncated && (
        <button type="button" className="review-card__more">
          Show more
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      )}
    </article>
  );
}

/**
 * The reviews block: overall score, the six category rating bars in two
 * columns, six review cards in a two-column grid, and a "Show all"
 * button. Static content matching Figma exactly — clickable ("Show
 * more" / "Show all 12 reviews") but not wired to any real expand or
 * pagination behaviour, same as the other clickable-but-inert controls
 * on this page.
 */
export default function Reviews() {
  return (
    <section className="detail-section">
      <h2 className="detail-section__title detail-section__title--inline">
        <StarIcon size={18} />
        <span>5.0 &middot; 7 reviews</span>
      </h2>

      <div className="rating-bars">
        <div className="rating-bars__column">
          {RATINGS_LEFT.map((item) => (
            <RatingBar key={item.label} {...item} />
          ))}
        </div>
        <div className="rating-bars__column">
          {RATINGS_RIGHT.map((item) => (
            <RatingBar key={item.label} {...item} />
          ))}
        </div>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </div>

      <button type="button" className="reviews__show-all">
        Show all 12 reviews
      </button>
    </section>
  );
}
