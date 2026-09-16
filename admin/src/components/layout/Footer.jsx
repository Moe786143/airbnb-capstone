/**
 * Site footer — Support / Community / Hosting / About link columns, plus
 * the legal + locale bar at the bottom. Matches the Figma export exactly,
 * including its two typos ("neighborhoood", "discriminatino") since the
 * brief is a pixel/content match, not a copyedit.
 */
import './Footer.css';

const COLUMNS = [
  {
    title: 'Support',
    links: [
      'Help Center',
      'Safety information',
      'Cancellation options',
      'Our COVID-19 Response',
      'Supporting people with disabilities',
      'Report a neighborhoood concern',
    ],
  },
  {
    title: 'Community',
    links: [
      'Airbnb.org: disaster relief housing',
      'Support: Afghan refugees',
      'Celebrating diversity & belonging',
      'Combating discriminatino',
    ],
  },
  {
    title: 'Hosting',
    links: [
      'Try hosting',
      'AirCover: protection for Hosts',
      'Explore hosting resources',
      'Visit our community forum',
      'How to host responsibly',
    ],
  },
  {
    title: 'About',
    links: [
      'Newsroom',
      'Learn about new features',
      'Letter from our founders',
      'Careers',
      'Investors',
      'Airbnb Luxe',
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__columns">
          {COLUMNS.map((col) => (
            <div className="site-footer__col" key={col.title}>
              <h3 className="site-footer__heading">{col.title}</h3>
              <ul className="site-footer__links">
                {col.links.map((label) => (
                  <li key={label}>
                    <a href="#">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__legal">
            © 2022 Airbnb, Inc. ·{' '}
            <a href="#">Privacy</a> ·{' '}
            <a href="#">Terms</a> ·{' '}
            <a href="#">Sitemap</a>
          </p>

          <div className="site-footer__locale">
            <span className="site-footer__locale-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" />
              </svg>
              English (US)
            </span>
            <span className="site-footer__locale-item">
              <span aria-hidden="true">$</span> USD
            </span>
            <span className="site-footer__social">
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.5H16l.5-3H13.5V8.3c0-.87.24-1.46 1.49-1.46H16.6V3.7C16.32 3.66 15.36 3.58 14.24 3.58c-2.33 0-3.93 1.42-3.93 4.03V10.5H7.8v3h2.51V21h3.19z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.3-.8.5-1.6.8-2.5 1-.7-.8-1.8-1.3-2.9-1.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9-3.3-.2-6.3-1.8-8.2-4.2-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.6 0-1.3-.2-1.8-.5v.1c0 1.9 1.4 3.5 3.2 3.9-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.2 4 1.8 6.3 1.8 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2.1-2.1z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
