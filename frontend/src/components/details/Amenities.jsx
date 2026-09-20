/**
 * "What this place offers" — Figma shows a fixed set of 10 amenities in
 * two columns, not the listing's own `amenities` array (which in this
 * app's data model is just 2-3 short strings, nowhere near enough to
 * match the reference). Per your instruction this section is static
 * copy/icons matching Figma exactly, including the "Show all 37
 * amenities" button — a real button with hover feedback, clickable but
 * inert since there's no amenities modal to open.
 */

const LEFT_COLUMN = [
  {
    label: 'Garden view',
    icon: (
      <path
        d="M12 21c5-2 8-6 8-11a12 12 0 0 0-8-8 12 12 0 0 0-8 8c0 5 3 9 8 11Z M8 13c2-1 3.5-3 4-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Wifi',
    icon: (
      <>
        <path
          d="M2 8.5a15 15 0 0 1 20 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M5.5 12.5a10 10 0 0 1 13 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M9 16.3a5 5 0 0 1 6 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="19.5" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'Free washer - in building',
    icon: (
      <>
        <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6.5" cy="6.5" r="0.9" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'Central air conditioning',
    icon: (
      <>
        <path d="M4 6h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="19" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 13h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="15" cy="13" r="1.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 20h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="21" cy="20" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    label: 'Refrigerator',
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 9h14" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 5.5v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 11.5v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

const RIGHT_COLUMN = [
  {
    label: 'Kitchen',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Pets allowed',
    icon: (
      <path
        d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Dryer',
    icon: (
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Security cameras on property',
    icon: (
      <>
        <rect x="2.5" y="7" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.5 10.5 21 7.5v9l-5.5-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: 'Bicycles',
    icon: (
      <>
        <circle cx="5.5" cy="17.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18.5" cy="17.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M15 5.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"
          fill="currentColor"
        />
        <path
          d="M5.5 17.5 10 8l2 3-3 6.5M10 8h4l4.5 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m14 11 2.5-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

function AmenityIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {children}
    </svg>
  );
}

function AmenityList({ items }) {
  return (
    <ul className="amenities__column">
      {items.map(({ label, icon }) => (
        <li className="amenities__item" key={label}>
          <span className="amenities__icon">
            <AmenityIcon>{icon}</AmenityIcon>
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}

export default function Amenities() {
  return (
    <section className="detail-section">
      <h2 className="detail-section__title">What this place offers</h2>

      <div className="amenities">
        <AmenityList items={LEFT_COLUMN} />
        <AmenityList items={RIGHT_COLUMN} />
      </div>

      <button type="button" className="amenities__show-all">
        Show all 37 amenities
      </button>
    </section>
  );
}
