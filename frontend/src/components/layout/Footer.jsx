/**
 * The static four-column site footer.
 *
 * Every link is a real, hoverable button — it just doesn't navigate
 * anywhere, since this is a front-end-only capstone build.
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
      'Report a neighborhoood concern',
    ],
  },
  {
    title: 'Community',
    links: [
      'Airbnb.org: disaster relief housing',
      'Combating discriminatino',
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
    title: 'About',
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
                    {/* Clickable — a real hover state — but goes nowhere */}
                    <button type="button" className="site-footer__link">
                      {link}
                    </button>
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
