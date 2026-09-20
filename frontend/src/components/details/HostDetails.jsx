import StarIcon from '../ui/StarIcon';
import { API_URL } from '../../api/client';

// The actual host photo you sent — already cropped to a circle with the
// Superhost ribbon badge baked in, so it's rendered as-is rather than
// composited with a separate badge overlay. Served from
// backend/public/images/ the same way the other real photos are.
const AVATAR_URL = `${API_URL.replace(/\/api$/, '')}/images/host-sarah.png`;

function VerifiedIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5l7 3v5.5c0 5-3.2 8.4-7 10.5-3.8-2.1-7-5.5-7-10.5V5.5l7-3z" />
      <polyline points="8.5 12 10.7 14.2 15.5 9.5" />
    </svg>
  );
}

function SuperhostIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5l2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 14.4l-5.1 2.8.98-5.68-4.13-4.02 5.7-.83L12 1.5z" />
    </svg>
  );
}

function PaymentShieldIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l7 3v5.5c0 5-3.2 8.4-7 10.5-3.8-2.1-7-5.5-7-10.5V5l7-3z"
        fill="#ffb400"
      />
      <polyline
        points="8.5 12 10.7 14.2 15.5 9.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * "About the Host" — the host profile block below Reviews. Everything but
 * the host's name is fixed content matching Figma exactly (the API only
 * stores a host username, not join dates / review counts / Superhost
 * status per host), so "12 Reviews", "Joined May 2021" and the bio copy
 * are the same on every listing. "Contact Host" is clickable with real
 * hover feedback but doesn't open a real contact flow.
 *
 * @param {string} host - the host's username
 */
export default function HostDetails({ host }) {
  return (
    <section className="detail-section">
      <div className="host">
        <div className="host__avatar-wrap">
          <img
            src={AVATAR_URL}
            alt=""
            className="host__avatar-img"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.nextSibling.style.display = 'grid';
            }}
          />
          <span className="host__avatar-fallback" aria-hidden="true">
            {host?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="host__name">Hosted by {host}</h2>
          <p className="host__joined">Joined May 2021</p>
        </div>
      </div>

      <div className="host__stats">
        <span className="host__stat">
          <StarIcon size={14} className="host__stat-icon" />
          12 Reviews
        </span>
        <span className="host__stat">
          <VerifiedIcon size={16} />
          Identity verified
        </span>
        <span className="host__stat">
          <SuperhostIcon size={16} />
          Superhost
        </span>
      </div>

      <h3 className="host__superhost-title">{host} is a Superhost</h3>
      <p className="host__bio">
        Superhosts are experienced, highly rated hosts who are committed to
        providing great stays for guests.
      </p>

      <p className="host__fact">Response rate: 100%</p>
      <p className="host__fact">Response time: within an hour</p>

      <button type="button" className="host__contact-btn">
        Contact Host
      </button>

      <div className="host__warning">
        <PaymentShieldIcon size={20} />
        <p>
          To protect your payment, never transfer money or communicate
          outside of the Airbnb website or app.
        </p>
      </div>
    </section>
  );
}
