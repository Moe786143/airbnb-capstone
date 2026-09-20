import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOCATIONS } from '../../data/locations';

/**
 * The search pill in the header — Figma's compact "Trio" component:
 * destination, dates, guests, each shown as plain text with no labels,
 * separated by dividers.
 *
 * Destination and guests are real — picking either jumps to (or updates)
 * the locations page, and the pill stays in sync with the URL both ways.
 * The dates segment mirrors Figma's "Feb 19-26" exactly but is static —
 * this app has no calendar picker built for it, so it isn't wired to
 * anything (same "looks real, does nothing" treatment as the rest of the
 * page's decoration).
 */
export default function HeaderSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get('location') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');

  // Keep the pill in step with the URL — covers back/forward navigation and
  // clicks on the destination cards on the home page.
  useEffect(() => {
    setSelected(searchParams.get('location') || '');
    setGuests(searchParams.get('guests') || '');
  }, [searchParams]);

  /**
   * Build the results URL and navigate. An empty selection means "Select
   * all locations", so the location parameter is left off entirely;
   * likewise for guests. Accepts an override for the field that just
   * changed, since a value passed straight from an onChange event is
   * available a render sooner than the state update that mirrors it.
   */
  const goToResults = (overrides = {}) => {
    const finalSelected = overrides.selected ?? selected;
    const finalGuests = overrides.guests ?? guests;

    const params = new URLSearchParams();
    if (finalSelected) params.set('location', finalSelected);
    if (finalGuests) params.set('guests', finalGuests);

    const query = params.toString();
    navigate(query ? `/locations?${query}` : '/locations');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    goToResults();
  };

  /** Picking a destination — including "Select all locations" — jumps
   * straight to the results page rather than waiting for the search
   * button. */
  const handleDestinationChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    goToResults({ selected: value });
  };

  return (
    <form className="header-search" onSubmit={handleSubmit} role="search">
      <select
        className="header-search__select"
        value={selected}
        onChange={handleDestinationChange}
        aria-label="Search destinations"
      >
        <option value="">Select all locations</option>
        {LOCATIONS.map((location) => (
          <option key={location.name} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>

      <span className="header-search__divider" aria-hidden="true" />

      <span className="header-search__hint">Feb 19-26</span>

      <span className="header-search__divider" aria-hidden="true" />

      <span className="header-search__guests-wrap">
        <input
          type="number"
          className="header-search__guests"
          inputMode="numeric"
          min="1"
          max="16"
          placeholder="Add"
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
          aria-label="Number of guests"
        />
        <span aria-hidden="true">guests</span>
      </span>

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
