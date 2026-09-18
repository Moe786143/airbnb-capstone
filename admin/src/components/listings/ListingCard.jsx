import SafeImage from '../ui/SafeImage';

/**
 * One row in "My Hotel List" — the photo plus the text block beside it
 * (subtitle, title, guest/bed/bath line, amenities, rating and price).
 *
 * Matches the Figma "Listing" component exactly, including its wording
 * ("beds"/"bath" rather than "bedrooms"/"bathrooms", a guest *range* like
 * "4-6 guests" rather than a single count, and — for a listing with no
 * price set — no "/night" line at all). The Update/Delete buttons and the
 * divider below each row are siblings of this component, not part of it
 * (see ListingsPage), matching the Figma layer structure.
 *
 * @param {object} listing - an accommodation document
 */
export default function ListingCard({ listing }) {
  const {
    images,
    title,
    subtitle,
    type,
    guestsLabel,
    guests,
    bedrooms,
    bathrooms,
    amenities,
    rating,
    reviews,
    price,
  } = listing;

  return (
    <div className="listing-row">
      <SafeImage src={images?.[0]} alt={title} className="listing-row__image" />

      <div className="listing-row__content">
        <div className="listing-row__heading">
          <p className="listing-row__subtitle">{subtitle || type}</p>
          <h3 className="listing-row__title">{title}</h3>
        </div>

        <div className="listing-row__hr" />

        <div className="listing-row__details">
          <p className="listing-row__meta">
            {guestsLabel || `${guests} guests`} &middot; {type} &middot; {bedrooms} beds &middot;{' '}
            {bathrooms} bath
          </p>
          {amenities?.length > 0 && (
            <p className="listing-row__amenities">{amenities.join(' · ')}</p>
          )}
        </div>

        <div className="listing-row__footer">
          <p className="listing-row__rating">
            {Number(rating || 0).toFixed(1)} <span className="listing-row__star">&#9733;</span>{' '}
            <span className="listing-row__reviews">({reviews} reviews)</span>
          </p>

          {price != null && (
            <p className="listing-row__price">
              <strong>${price}</strong> <span>/night</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
