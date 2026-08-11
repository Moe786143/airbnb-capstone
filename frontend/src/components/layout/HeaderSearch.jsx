import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOCATIONS } from '../../data/locations';

/**
 * The search pill in the header.
 *
 * Lets the user pick a destination from anywhere in the app and jumps to
 * the locations page with that filter applied. It stays in sync with the
 * URL, so arriving at /locations?location=Paris shows "Paris" already
 * selected rather than the placeholder.
 */
export default function HeaderSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get('location') || '');

  // Keep the pill in step with the URL — covers back/forward navigation and
  // clicks on the destination cards on the home page.
  useEffect(() => {
    setSelected(searchParams.get('location') || '');
  }, [searchParams]);

  /**
   * Navigate to the results page. An empty selection means "Anywhere", so
   * the location parameter is left off entirely.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(selected ? `/locations?location=${encodeURIComponent(selected)}` : '/locations');
  };

  return (
    <form className="header-search" onSubmit={handleSubmit} role="search">
      <label className="header-search__field">
        <span className="header-search__label">Where</span>
        <select
          className="header-search__select"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          aria-label="Search destinations"
        >
          <option value="">Anywhere</option>
          {LOCATIONS.map((location) => (
            <option key={location.name} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <span className="header-search__divider" aria-hidden="true" />

      <span className="header-search__hint">Any week</span>

      <button type="submit" className="header-search__button" aria-label="Search">
        <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true">
          <path
            d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3l9 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}
