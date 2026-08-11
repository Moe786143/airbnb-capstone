import StarIcon from '../ui/StarIcon';

/**
 * "Hosted by <name>" — the host profile block.
 *
 * The API only stores the host's username on a listing, so the surrounding
 * detail (response rate, response time, Superhost status) is presentational
 * filler consistent with Airbnb's own layout.
 *
 * @param {string} host - the host's username
 * @param {number} reviews - review count, shown on the host summary line
 */
export default function HostDetails({ host, reviews }) {
  return (
    <section className="detail-section">
      <div className="host">
        <div className="host__avatar" aria-hidden="true">
          {host?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="host__name">Hosted by {host}</h2>
          <p className="host__joined">Joined in 2019</p>
        </div>
      </div>

      <div className="host__stats">
        <span className="host__stat">
          <StarIcon />
          {reviews} reviews
        </span>
        <span className="host__stat">✓ Identity verified</span>
        <span className="host__stat">🏅 Superhost</span>
      </div>

      <p className="host__bio">
        {host} is a Superhost — an experienced, highly rated host committed to
        providing great stays for guests.
      </p>

      <ul className="host__facts">
        <li>Response rate: 100%</li>
        <li>Response time: within an hour</li>
        <li>Languages: English, French</li>
      </ul>

      <button type="button" className="btn btn--dark">
        Contact host
      </button>

      <p className="host__warning">
        To protect your payment, never transfer money or communicate outside of
        the Airbnb website or app.
      </p>
    </section>
  );
}
