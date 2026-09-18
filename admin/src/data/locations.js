/**
 * The destinations the customer site's search recognizes — mirrors
 * frontend/src/data/locations.js so a listing created here can actually be
 * found by a guest's search (the API does a partial, case-insensitive
 * match on `location`, and the search dropdown only offers these names).
 *
 * Kept as its own copy rather than imported across app boundaries because
 * admin and frontend are separate Vite projects with their own dependency
 * trees — there's nothing here to import from at build time.
 */
export const LOCATIONS = [
  { name: 'Paris', region: 'France' },
  { name: 'Big Sur', region: 'California' },
  { name: 'Tokyo', region: 'Japan' },
  { name: 'Santorini', region: 'Greece' },
  { name: 'London', region: 'United Kingdom' },
  { name: 'Joshua Tree', region: 'California' },
  { name: 'Mexico City', region: 'Mexico' },
  { name: 'Zermatt', region: 'Switzerland' },
];
