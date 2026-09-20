/**
 * The collapsed "Start your search" pill shown in the listing detail
 * page's nav — Figma's "Airbnb Search" component in its Search state.
 * This page has no location/date/guest state of its own to reflect (that
 * lives on the results page), so it's a real, hoverable button that
 * doesn't navigate anywhere — the same "looks interactive, does nothing"
 * treatment used for this page's other decorative controls.
 */
export default function StartSearchPill() {
  return (
    <button type="button" className="start-search-pill" aria-label="Start your search">
      <span className="start-search-pill__label">Start your search</span>
      <span className="start-search-pill__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true">
          <path
            d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3l9 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
}
