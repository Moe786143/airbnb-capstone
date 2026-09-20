import { useState } from 'react';

/**
 * "Inspiration for future getaways" — a tabbed explorer, matching the
 * Figma section's six tab labels exactly.
 *
 * Only the first tab ("Destinations for arts & culture") has real content
 * behind it in the design — the other five are still real, clickable
 * tabs (so the active underline moves), but show that same destination
 * list rather than each needing its own curated set. The destinations
 * themselves (and "Show more") are clickable — real buttons with a hover
 * state — but deliberately go nowhere: this list isn't wired to search.
 */

/** The six tab labels, in the exact order and wording Figma shows. */
const TABS = [
  'Destinations for arts & culture',
  'Destinations for outdoor adventure',
  'Mountain cabins',
  'Beach destinations',
  'Popular destinations',
  'Unique Stays',
];

/** The destination grid — identical under every tab. */
const DESTINATIONS = [
  { city: 'Phoenix', region: 'Arizona' },
  { city: 'Hot Springs', region: 'Arkansas' },
  { city: 'Los Angeles', region: 'California' },
  { city: 'San Diego', region: 'California' },
  { city: 'San Francisco', region: 'California' },
  { city: 'Barcelona', region: 'Catalonia' },
  { city: 'Prague', region: 'Czechia' },
  { city: 'Washington', region: 'District of Columbia' },
  { city: 'Keswick', region: 'England' },
  { city: 'London', region: 'England' },
  { city: 'Scarborough', region: 'England' },
];

export default function FutureGetaways() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section className="section container">
      <h2 className="section__title">Inspiration for future getaways</h2>

      {/* Tab strip */}
      <div className="tabs" role="tablist" aria-label="Getaway categories">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`tab-${tab}`}
            aria-selected={tab === activeTab}
            aria-controls="panel-getaways"
            className={`tabs__tab${tab === activeTab ? ' tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panel: the same destination grid under every tab */}
      <div
        className="tabs__panel"
        role="tabpanel"
        id="panel-getaways"
        aria-labelledby={`tab-${activeTab}`}
      >
        <ul className="getaway-list">
          {DESTINATIONS.map((item) => (
            <li className="getaway-list__item" key={item.city}>
              <button type="button" className="getaway-list__link">
                <span className="getaway-list__city">{item.city}</span>
                <span className="getaway-list__type">{item.region}</span>
              </button>
            </li>
          ))}

          <li className="getaway-list__item">
            <button type="button" className="getaway-list__link getaway-list__show-more">
              Show more
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}
