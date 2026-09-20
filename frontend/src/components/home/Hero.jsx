import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../../data/locations';
import heroPhoto from '../../assets/hero-photo.png';

/**
 * The home page's hero: a floating destination-search pill sitting above a
 * big rounded photo. "Not sure where to go? Perfect." and the "I'm
 * flexible" button are part of the photo itself (it's the actual reference
 * image, text and all). The card is a real, hoverable button — matching
 * every other baked-in-photo control in this app — but it doesn't navigate
 * anywhere; only the search pill above it is a real destination search.
 *
 * Locations and Guests are real — the same `LOCATIONS` list the header
 * search and the locations page use, and the locations page filters by
 * guest count against each listing's capacity. Check in date/Checkout
 * date are shown exactly as in the reference but stay static — this app
 * has no calendar picker built for them, so they aren't wired to
 * anything. Picking a destination — including "Select all locations" —
 * jumps straight to the results page rather than waiting for the search
 * button; the button stays for anyone who set a guest count first and
 * wants to submit that without touching the dropdown.
 */
export default function Hero() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('');

  /**
   * Build the results URL and navigate. Accepts an override for the field
   * that just changed, since a value passed straight from an onChange
   * event is available a render sooner than the state update that mirrors
   * it would be.
   */
  const goToResults = (overrides = {}) => {
    const finalDestination = overrides.destination ?? destination;
    const finalGuests = overrides.guests ?? guests;

    const params = new URLSearchParams();
    if (finalDestination) params.set('location', finalDestination);
    if (finalGuests) params.set('guests', finalGuests);

    const query = params.toString();
    navigate(query ? `/locations?${query}` : '/locations');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    goToResults();
  };

  const handleDestinationChange = (event) => {
    const value = event.target.value;
    setDestination(value);
    goToResults({ destination: value });
  };

  return (
    <section className="hero">
      <div className="container hero__pill-wrap">
        <form className="hero-search" onSubmit={handleSearch} role="search">
          <label className="hero-search__field">
            <span className="hero-search__label">Locations</span>
            <span className="hero-search__value-wrap">
              <select
                className="hero-search__select"
                value={destination}
                onChange={handleDestinationChange}
                aria-label="Select a destination"
              >
                <option value="">Select all locations</option>
                {LOCATIONS.map((location) => (
                  <option key={location.name} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
              <svg className="hero-search__chevron" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path
                  d="M2 5l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </label>

          <span className="hero-search__divider" aria-hidden="true" />

          <div className="hero-search__field hero-search__field--static">
            <span className="hero-search__label">Check in date</span>
            <span className="hero-search__hint">Select date</span>
          </div>

          <span className="hero-search__divider" aria-hidden="true" />

          <div className="hero-search__field hero-search__field--static">
            <span className="hero-search__label">Checkout date</span>
            <span className="hero-search__hint">Select date</span>
          </div>

          <span className="hero-search__divider" aria-hidden="true" />

          <label className="hero-search__field">
            <span className="hero-search__label">Guests</span>
            <input
              type="number"
              className="hero-search__guests"
              inputMode="numeric"
              min="1"
              max="16"
              placeholder="Add guests"
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              aria-label="Number of guests"
            />
          </label>

          <button type="submit" className="hero-search__button" aria-label="Search">
            <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
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
      </div>

      <div className="container">
        {/* Clickable — a real hover state — but the "I'm flexible" button
            baked into this photo doesn't lead anywhere. */}
        <button
          type="button"
          className="hero__card"
          style={{ backgroundImage: `url(${heroPhoto})` }}
          aria-label="Not sure where to go? Search with flexible dates"
        />
      </div>
    </section>
  );
}
