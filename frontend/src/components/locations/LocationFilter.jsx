import { LOCATIONS } from '../../data/locations';

/**
 * The destination dropdown on the locations page.
 *
 * A controlled select whose value comes from the URL query string, so the
 * page is shareable and the browser's back button works. Choosing an option
 * hands the new value up to the page, which rewrites the URL.
 *
 * @param {string} value - the current location ('' means Anywhere)
 * @param {Function} onChange - called with the newly selected location
 */
export default function LocationFilter({ value, onChange }) {
  return (
    <div className="location-filter">
      <label className="location-filter__label" htmlFor="location-select">
        Destination
      </label>
      <div className="location-filter__control">
        <select
          id="location-select"
          className="location-filter__select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {/* The default option — no filter, show everything */}
          <option value="">Anywhere</option>
          {LOCATIONS.map((location) => (
            <option key={location.name} value={location.name}>
              {location.name}, {location.region}
            </option>
          ))}
        </select>
        <svg
          className="location-filter__chevron"
          viewBox="0 0 16 16"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="M2 5l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
