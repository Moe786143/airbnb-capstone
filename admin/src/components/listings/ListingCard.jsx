import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';
import { formatCurrency } from '../../utils/format';

/**
 * One of the host's listings in the dashboard grid.
 *
 * Shows the main photo, title, location and nightly price, with Update and
 * Delete actions. Deleting is handed up to the page, which owns the
 * confirmation dialog and the request.
 *
 * @param {object} listing - an accommodation document
 * @param {Function} onDelete - called with the listing when Delete is clicked
 * @param {boolean} [deleting=false] - true while this listing is being removed
 */
export default function ListingCard({ listing, onDelete, deleting = false }) {
  const { _id, images, title, location, price, type, guests, bedrooms, bathrooms } = listing;

  return (
    <article className={`listing-card${deleting ? ' listing-card--busy' : ''}`}>
      <div className="listing-card__media">
        <SafeImage src={images?.[0]} alt={title} className="listing-card__image" />
      </div>

      <div className="listing-card__body">
        <p className="listing-card__type">{type}</p>
        <h2 className="listing-card__title">{title}</h2>
        <p className="listing-card__location">{location}</p>

        <p className="listing-card__meta">
          {guests} guests &middot; {bedrooms} bedroom{bedrooms === 1 ? '' : 's'} &middot;{' '}
          {bathrooms} bathroom{bathrooms === 1 ? '' : 's'}
        </p>

        <p className="listing-card__price">
          <strong>{formatCurrency(price)}</strong> <span>per night</span>
        </p>

        <div className="listing-card__actions">
          <Link to={`/listings/${_id}/edit`} className="btn btn--outline btn--sm">
            Update
          </Link>
          <button
            type="button"
            className="btn btn--danger-ghost btn--sm"
            onClick={() => onDelete(listing)}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
