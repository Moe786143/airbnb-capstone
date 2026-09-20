import { useState } from 'react';
import { API_URL } from '../../api/client';

// The same real host photo used on the "About the Host" avatar below —
// same file, same framing, so the two match exactly.
const AVATAR_URL = `${API_URL.replace(/\/api$/, '')}/images/host-sarah.png`;

/**
 * The block directly under the gallery: who hosts the place, how big it is,
 * the two service highlights, and the description.
 *
 * @param {object} accommodation
 */
export default function Overview({ accommodation }) {
  const { type, host, guests, bedrooms, bathrooms, description } = accommodation;
  // Figma clamps the description to 5 lines (670 x 120 Hug, 16px/24px type)
  // with a "Show more" toggle below it. The full text is already on hand, so
  // this is genuinely functional rather than clickable-but-inert — no modal,
  // it just expands/collapses the same paragraph in place.
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  return (
    <section className="detail-section detail-section--first">
      <div className="overview__header">
        <div>
          <h2 className="overview__title">
            {type} hosted by {host}
          </h2>
          <p className="overview__meta">
            {guests} guests &middot; {bedrooms} bedroom{bedrooms === 1 ? '' : 's'} &middot;{' '}
            {bathrooms} bathroom{bathrooms === 1 ? '' : 's'}
          </p>
        </div>
        {/* The same real host photo used every listing (the API only
            stores a host username, not a per-host picture). Clickable,
            with real hover feedback, but there's no host profile page for
            it to open. Falls back to the initial if the image can't load
            (e.g. offline). */}
        <button type="button" className="overview__avatar" aria-label={`${host}'s profile`}>
          <img
            src={AVATAR_URL}
            alt=""
            className="overview__avatar-img"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.nextSibling.style.display = 'grid';
            }}
          />
          <span className="overview__avatar-fallback" aria-hidden="true">
            {host?.charAt(0).toUpperCase()}
          </span>
        </button>
      </div>

      {/* Figma's "Details" block: the same four highlights, in the same
          order, on every listing (Entire home, Enhanced Clean, Self
          check-in, Free cancellation before Feb 14) — fixed copy, not
          driven by a per-listing data field, so it looks identical no
          matter which listing you open. The divider above (this list's
          border-top) and below (the description's border-top) are the
          two horizontal rules Figma uses instead of a drawn box. */}
      <ul className="highlights">
        <li className="highlight">
          <span className="highlight__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 15.5 16 6l11 9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 13v12.5A1 1 0 0 0 9 26.5h14a1 1 0 0 0 1-1V13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="highlight__title">Entire home</p>
            <p className="highlight__copy">You&apos;ll have the apartment to yourself</p>
          </div>
        </li>

        <li className="highlight">
          <span className="highlight__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(1 0) scale(1.05)">
                <path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96l6.13-1.58A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.59 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.59 6.14a.5.5 0 0 1-.96 0Z" />
              </g>
              <g transform="translate(15.5 14.5) scale(0.5)">
                <path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96l6.13-1.58A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.59 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.59 6.14a.5.5 0 0 1-.96 0Z" />
              </g>
            </svg>
          </span>
          <div>
            <p className="highlight__title">Enhanced Clean</p>
            <p className="highlight__copy">
              This Host committed to Airbnb&apos;s 5-step enhanced cleaning process.{' '}
              <button type="button" className="highlight__more">
                Show more
              </button>
            </p>
          </div>
        </li>

        <li className="highlight">
          <span className="highlight__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="8"
                y="4"
                width="16"
                height="24"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="M19 15.2h2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <p className="highlight__title">Self check-in</p>
            <p className="highlight__copy">Check yourself in with the keypad.</p>
          </div>
        </li>

        <li className="highlight highlight--inline">
          <span className="highlight__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="7" width="24" height="21" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 13h24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M10.5 4v6M21.5 4v6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="highlight__title">Free cancellation before Feb 14</p>
        </li>
      </ul>

      {description && (
        <div className="overview__description">
          <p
            className={`overview__description-text${
              descriptionExpanded ? '' : ' overview__description-text--clamped'
            }`}
          >
            {description}
          </p>
          <button
            type="button"
            className={`overview__description-toggle${
              descriptionExpanded ? ' overview__description-toggle--expanded' : ''
            }`}
            onClick={() => setDescriptionExpanded((expanded) => !expanded)}
          >
            {descriptionExpanded ? 'Show less' : 'Show more'}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
