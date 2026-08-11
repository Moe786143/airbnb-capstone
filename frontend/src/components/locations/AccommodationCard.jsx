import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';
import StarIcon from '../ui/StarIcon';
import { formatCurrency, formatRating } from '../../utils/format';

/**
 * A single search result on the locations page.
 *
 * Horizontal layout: photo on the left, details on the right — type and
 * location, title, a short amenities summary, then the star rating and
 * review count beside the nightly price. The whole card is one link to
 * /locations/:id.
 *
 * @param {object} accommodation - a listing from GET /api/accommodations
 */
export default function AccommodationCard({ accommodation }) {
  const {
    _id,
    images,
    type,
    location,
    title,
    amenities = [],
    rating,
    reviews,
    price,
    guests,
    bedrooms,
    bathrooms,
  } = accommodation;

  return (
    <Link to={`/locations/${_id}`} className="stay-card">
      <div className="stay-card__media">
        <SafeImage src={images?.[0]} alt={title} className="stay-card__image" />
      </div>

      <div className="stay-card__body">
        <div className="stay-card__main">
          <p className="stay-card__type">
            {type} in {location}
          </p>
          <h3 className="stay-card__title">{title}</h3>

          <span className="stay-card__rule" aria-hidden="true" />

          {/* Capacity summary — the detail guests scan for first */}
          <p className="stay-card__meta">
            {guests} guests &middot; {bedrooms} bedroom{bedrooms === 1 ? '' : 's'} &middot;{' '}
            {bathrooms} bathroom{bathrooms === 1 ? '' : 's'}
          </p>

          {/* Show the first few amenities, with a count for the rest */}
          {amenities.length > 0 && (
            <p className="stay-card__amenities">
              {amenities.slice(0, 4).join(' · ')}
              {amenities.length > 4 && ` · +${amenities.length - 4} more`}
            </p>
          )}
        </div>

        <div className="stay-card__footer">
          <span className="stay-card__rating">
            <StarIcon />
            <strong>{formatRating(rating)}</strong>
            <span className="stay-card__reviews">({reviews} reviews)</span>
          </span>

          <span className="stay-card__price">
            <strong>{formatCurrency(price)}</strong> / night
          </span>
        </div>
      </div>
    </Link>
  );
}
