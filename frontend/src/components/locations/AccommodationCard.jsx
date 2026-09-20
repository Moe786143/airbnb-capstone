import { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';
import StarIcon from '../ui/StarIcon';
import { formatCurrency, formatRating } from '../../utils/format';

/** "Entire Home" -> "Entire home" — Figma's copy only capitalises the first word. */
const sentenceCase = (text) => (text ? text.charAt(0) + text.slice(1).toLowerCase() : text);

/** "Bordeaux, France" -> "Bordeaux" — the results page shows just the city. */
const cityOnly = (location) => (location ? location.split(',')[0].trim() : location);

/**
 * A single search result on the locations page.
 *
 * Horizontal layout: photo on the left, details on the right — type and
 * city, title, capacity summary, amenities, then the star rating and
 * review count beside the nightly price — matching Figma's "Luxe Search"
 * listing row. The photo and details are one link to /locations/:id; the
 * save (heart) button sits on top of that, so it needs its own click
 * handler to stop the click from also following the link.
 *
 * The heart is a real like toggle — filling in on click, emptying on a
 * second click — but it's local component state only, not saved anywhere,
 * so it resets on refresh.
 *
 * @param {object} accommodation - a listing from GET /api/accommodations
 */
export default function AccommodationCard({ accommodation }) {
  const [liked, setLiked] = useState(false);

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
    guestsLabel,
    bedrooms,
    bathrooms,
  } = accommodation;

  return (
    <div className="stay-card">
      <Link to={`/locations/${_id}`} className="stay-card__link">
        <div className="stay-card__media">
          <SafeImage src={images?.[0]} alt={title} className="stay-card__image" />
        </div>

        <div className="stay-card__body">
          <div className="stay-card__main">
            <p className="stay-card__type">
              {sentenceCase(type)} in {cityOnly(location)}
            </p>
            <h3 className="stay-card__title">{title}</h3>

            <span className="stay-card__rule" aria-hidden="true" />

            {/* Capacity summary — the detail guests scan for first */}
            <p className="stay-card__meta">
              {guestsLabel} &middot; {type} &middot; {bedrooms} bed{bedrooms === 1 ? '' : 's'} &middot;{' '}
              {bathrooms} bath{bathrooms === 1 ? '' : 's'}
            </p>

            {amenities.length > 0 && <p className="stay-card__amenities">{amenities.join(' · ')}</p>}
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

      {/* A real like toggle — not persisted anywhere, just this card's own
          state — so it needs its own click handler to stop the click from
          also following the card's link. */}
      <button
        type="button"
        className={`stay-card__save${liked ? ' stay-card__save--liked' : ''}`}
        aria-label={liked ? 'Remove from favourites' : 'Save to favourites'}
        aria-pressed={liked}
        onClick={(event) => {
          event.preventDefault();
          setLiked((current) => !current);
        }}
      >
        <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
          <path
            d="M16 28s-11-6.7-11-15A6.5 6.5 0 0 1 16 9.5 6.5 6.5 0 0 1 27 13c0 8.3-11 15-11 15z"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
