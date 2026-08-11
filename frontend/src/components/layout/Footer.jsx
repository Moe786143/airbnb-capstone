/**
 * The static four-column site footer.
 *
 * Purely presentational — the links are placeholders, matching Airbnb's own
 * footer structure of Support / Community / Hosting / About.
 */

/** Column headings and their links, kept as data to avoid repeating markup. */
const COLUMNS = [
  {
    title: 'Support',
    links: [
      'Help Centre',
      'AirCover',
      'Anti-discrimination',
      'Disability support',
      'Cancellation options',
      'Report a neighbourhood concern',
    ],
  },
  {
    title: 'Community',
    links: [
      'Airbnb.org: disaster relief housing',
      'Combating discrimination',
      'Invite friends',
      'Gift cards',
      'Referral programme',
    ],
  },
  {
    title: 'Hosting',
    links: [
      'Airbnb your home',
      'AirCover for Hosts',
      'Hosting resources',
      'Community forum',
      'Hosting responsibly',
      'Join a free Hosting class',
    ],
  },
  {
    title: 'Airbnb',
    links: [
      'Newsroom',
      'New features',
      'Careers',
      'Investors',
      'Airbnb luxe',
      'Emergency stays',
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          {COLUMNS.map((column) => (
            <nav className="site-footer__column" key={column.title} aria-label={column.title}>
              <h3 className="site-footer__heading">{column.title}</h3>
              <ul className="site-footer__list">
                {column.links.map((link) => (
                  <li key={link}>
                    {/* Placeholder links — no destinations in a capstone build */}
                    <a href="#/" className="site-footer__link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
