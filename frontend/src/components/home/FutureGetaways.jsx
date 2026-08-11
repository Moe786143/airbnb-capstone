import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOCATION_NAMES } from '../../data/locations';

/**
 * "Inspiration for future getaways" — a tabbed explorer.
 *
 * Five tabs, each rendering its destinations as a multi-column list the way
 * Airbnb's own footer explorer does. Destinations the API actually has
 * listings for become links to the filtered locations page; the rest are
 * inert placeholders, so no tab ever leads to a dead end that looks broken.
 */

/** Tab definitions: a label plus the destinations shown underneath. */
const TABS = [
  {
    id: 'popular',
    label: 'Popular',
    items: [
      { city: 'Paris', type: 'Loft rentals' },
      { city: 'Tokyo', type: 'Apartment rentals' },
      { city: 'London', type: 'Flat rentals' },
      { city: 'Mexico City', type: 'Townhouse rentals' },
      { city: 'Santorini', type: 'Villa rentals' },
      { city: 'Big Sur', type: 'Cabin rentals' },
      { city: 'Joshua Tree', type: 'House rentals' },
      { city: 'Zermatt', type: 'Chalet rentals' },
      { city: 'Barcelona', type: 'Apartment rentals' },
      { city: 'Lisbon', type: 'Flat rentals' },
      { city: 'New York', type: 'Loft rentals' },
      { city: 'Reykjavík', type: 'Cottage rentals' },
    ],
  },
  {
    id: 'arts-culture',
    label: 'Arts & culture',
    items: [
      { city: 'Paris', type: 'Museum district stays' },
      { city: 'London', type: 'Theatre district stays' },
      { city: 'Mexico City', type: 'Gallery quarter stays' },
      { city: 'Tokyo', type: 'Design district stays' },
      { city: 'Florence', type: 'Renaissance stays' },
      { city: 'Vienna', type: 'Opera house stays' },
      { city: 'Berlin', type: 'Studio loft stays' },
      { city: 'Kyoto', type: 'Machiya stays' },
      { city: 'Amsterdam', type: 'Canal house stays' },
      { city: 'Prague', type: 'Old town stays' },
      { city: 'Havana', type: 'Colonial stays' },
      { city: 'Marrakesh', type: 'Riad stays' },
    ],
  },
  {
    id: 'outdoors',
    label: 'Outdoor adventure',
    items: [
      { city: 'Big Sur', type: 'Coastal hikes' },
      { city: 'Joshua Tree', type: 'Desert climbing' },
      { city: 'Zermatt', type: 'Alpine trails' },
      { city: 'Queenstown', type: 'Adventure sports' },
      { city: 'Banff', type: 'Lake trails' },
      { city: 'Patagonia', type: 'Trekking bases' },
      { city: 'Chamonix', type: 'Mountaineering' },
      { city: 'Moab', type: 'Canyon trails' },
      { city: 'Interlaken', type: 'Paragliding' },
      { city: 'Torres del Paine', type: 'Wilderness camps' },
      { city: 'Dolomites', type: 'Via ferrata' },
      { city: 'Lake District', type: 'Fell walking' },
    ],
  },
  {
    id: 'mountain',
    label: 'Mountain cabins',
    items: [
      { city: 'Zermatt', type: 'Ski-in chalets' },
      { city: 'Big Sur', type: 'Redwood cabins' },
      { city: 'Aspen', type: 'Log cabins' },
      { city: 'Whistler', type: 'Slope-side lodges' },
      { city: 'Hakuba', type: 'Powder cabins' },
      { city: 'Åre', type: 'Nordic lodges' },
      { city: 'Cortina', type: 'Alpine huts' },
      { city: 'Jackson Hole', type: 'Ranch cabins' },
      { city: 'Verbier', type: 'Mountain chalets' },
      { city: 'Niseko', type: 'Onsen cabins' },
      { city: 'Bariloche', type: 'Lakeside cabins' },
      { city: 'Tromsø', type: 'Aurora cabins' },
    ],
  },
  {
    id: 'beach',
    label: 'Beach escapes',
    items: [
      { city: 'Santorini', type: 'Caldera villas' },
      { city: 'Big Sur', type: 'Ocean-view cabins' },
      { city: 'Tulum', type: 'Beachfront casitas' },
      { city: 'Amalfi', type: 'Cliffside villas' },
      { city: 'Bali', type: 'Surf villas' },
      { city: 'Algarve', type: 'Coastal houses' },
      { city: 'Maui', type: 'Beach bungalows' },
      { city: 'Ibiza', type: 'Sea-view fincas' },
      { city: 'Phuket', type: 'Island villas' },
      { city: 'Sardinia', type: 'Coastal stays' },
      { city: 'Cape Town', type: 'Ocean apartments' },
      { city: 'Byron Bay', type: 'Surf shacks' },
    ],
  },
];

export default function FutureGetaways() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const active = TABS.find((tab) => tab.id === activeTab);

  return (
    <section className="section container">
      <h2 className="section__title">Inspiration for future getaways</h2>

      {/* Tab strip */}
      <div className="tabs" role="tablist" aria-label="Getaway categories">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === activeTab}
            aria-controls={`panel-${tab.id}`}
            className={`tabs__tab${tab.id === activeTab ? ' tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel: a multi-column list of destinations for the active tab */}
      <div
        className="tabs__panel"
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
      >
        <ul className="getaway-list">
          {active.items.map((item) => {
            // Only destinations the API has data for become real links.
            const isBookable = LOCATION_NAMES.includes(item.city);

            return (
              <li className="getaway-list__item" key={`${active.id}-${item.city}-${item.type}`}>
                {isBookable ? (
                  <Link
                    to={`/locations?location=${encodeURIComponent(item.city)}`}
                    className="getaway-list__link"
                  >
                    <span className="getaway-list__city">{item.city}</span>
                    <span className="getaway-list__type">{item.type}</span>
                  </Link>
                ) : (
                  <span className="getaway-list__link getaway-list__link--static">
                    <span className="getaway-list__city">{item.city}</span>
                    <span className="getaway-list__type">{item.type}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
