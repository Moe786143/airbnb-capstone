/**
 * The block directly under the gallery: who hosts the place, how big it is,
 * the two service highlights, and the description.
 *
 * @param {object} accommodation
 */
export default function Overview({ accommodation }) {
  const { type, host, guests, bedrooms, bathrooms, enhancedCleaning, selfCheckIn, description } =
    accommodation;

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
        {/* Initial-only avatar, consistent with the header's profile menu */}
        <div className="overview__avatar" aria-hidden="true">
          {host?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Only render the highlights that this listing actually offers */}
      {(selfCheckIn || enhancedCleaning) && (
        <ul className="highlights">
          {selfCheckIn && (
            <li className="highlight">
              <span className="highlight__icon" aria-hidden="true">
                🔑
              </span>
              <div>
                <p className="highlight__title">Self check-in</p>
                <p className="highlight__copy">
                  Check yourself in with the keypad — arrive whenever suits you.
                </p>
              </div>
            </li>
          )}
          {enhancedCleaning && (
            <li className="highlight">
              <span className="highlight__icon" aria-hidden="true">
                ✨
              </span>
              <div>
                <p className="highlight__title">Enhanced Clean</p>
                <p className="highlight__copy">
                  This host follows Airbnb&apos;s 5-step enhanced cleaning process.
                </p>
              </div>
            </li>
          )}
        </ul>
      )}

      {description && <p className="overview__description">{description}</p>}
    </section>
  );
}
