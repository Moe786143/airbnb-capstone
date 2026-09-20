/**
 * The destinations the customer site actually hosts listings in right now.
 *
 * `name` is what gets sent to the API as the `location` query parameter —
 * the backend does a partial, case-insensitive match against each
 * accommodation's `location` field ("Sandton, Johannesburg" / "Bordeaux,
 * France" in the seed data), so the bare city name is enough to match.
 * `region` is display-only, shown alongside the city in longer lists.
 *
 * Kept trimmed to exactly what's in the database — a destination picker
 * that offers cities with nothing to show is worse than no picker at all.
 */
export const LOCATIONS = [
  { name: 'Sandton', region: 'Johannesburg' },
  { name: 'Bordeaux', region: 'France' },
];

/** Just the names — handy for building <select> options. */
export const LOCATION_NAMES = LOCATIONS.map((location) => location.name);
