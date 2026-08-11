/**
 * The eight destinations the app features.
 *
 * `name` is what gets sent to the API as the `location` query parameter —
 * the backend does a partial, case-insensitive match, so "Paris" finds
 * "Paris, France". `region` is display-only.
 */
export const LOCATIONS = [
  {
    name: 'Paris',
    region: 'France',
    distance: '5,837 kilometres away',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Big Sur',
    region: 'California',
    distance: '2,412 kilometres away',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Tokyo',
    region: 'Japan',
    distance: '9,204 kilometres away',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Santorini',
    region: 'Greece',
    distance: '7,118 kilometres away',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'London',
    region: 'United Kingdom',
    distance: '5,570 kilometres away',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Joshua Tree',
    region: 'California',
    distance: '2,908 kilometres away',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Mexico City',
    region: 'Mexico',
    distance: '3,142 kilometres away',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=70',
  },
  {
    name: 'Zermatt',
    region: 'Switzerland',
    distance: '6,340 kilometres away',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=70',
  },
];

/** Just the names — handy for building <select> options. */
export const LOCATION_NAMES = LOCATIONS.map((location) => location.name);
