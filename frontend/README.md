# Airbnb Capstone — Frontend

Customer-facing React app for the Airbnb clone capstone. Built with **React 18**, **Vite**, and **react-router-dom**, consuming the Express API in `../backend`.

---

## Getting started

The backend must be running first — see `../backend/README.md`.

```bash
cd frontend
npm install
cp .env.example .env      # points at http://localhost:5000/api
npm run dev               # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 3000 with hot reload |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serve the built bundle locally |

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the backend API |

Only `VITE_`-prefixed variables are exposed to the browser. Change this one value to point the app at a deployed backend — no code changes needed.

The dev server runs on port 3000 to match the backend's default `CLIENT_URL`, so CORS works with no extra setup.

---

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | `HomePage` | Hero, destination grid, Experiences, gift cards, tabbed getaways |
| `/locations` | `LocationsPage` | Search results, filtered by `?location=` |
| `/locations/:id` | `LocationDetailsPage` | Full listing with gallery and cost calculator |
| `*` | `NotFoundPage` | Catch-all for unknown URLs |

---

## Project structure

```
src/
├── api/client.js              # every call to the backend lives here
├── components/
│   ├── auth/LoginModal.jsx
│   ├── details/               # gallery, overview, amenities, reviews,
│   │                          #   host, policies, CostCalculator
│   ├── home/                  # hero, inspiration, experiences, shop, tabs
│   ├── layout/                # header, search, profile menu, footers
│   ├── locations/             # destination filter, listing card
│   └── ui/                    # Modal, Spinner, ErrorMessage, SafeImage, StarIcon
├── context/AuthContext.jsx    # session state + login modal control
├── data/locations.js          # the eight featured destinations
├── hooks/useFetch.js          # loading / error / data for every fetch
├── pages/                     # one file per route
├── styles/                    # index, layout, home, locations, details
└── utils/format.js            # currency, dates, and the pricing formula
```

---

## How it works

### Authentication

`AuthContext` owns the session. The JWT is kept in `localStorage` under `airbnb_token`; on every page load it is exchanged for a profile via `GET /api/users/me`, so a refresh keeps you logged in and a token that has expired or been revoked is discarded cleanly.

The login dialog's open state also lives in the context, which lets the cost calculator prompt for a login without the header having to pass a callback down the tree.

### Cost calculator

`utils/format.js → calculateBreakdown()` deliberately mirrors the backend's `calculateTotalCost()`:

```
(price × nights) − weekly discount + cleaningFee + serviceFee + occupancyTaxes
```

The weekly discount is a percentage that applies only to stays of 7 nights or more. Because both sides use the same formula, the total shown before booking always equals the `totalCost` the server stores — verified against a live backend during development.

The dates and guest count live in `LocationDetailsPage`, not in the calculator, because the "N nights in \<city\>" section displays the same range. One source of truth, two consumers.

The page opens with a seven-night range starting a week out, so the breakdown is populated on arrival rather than empty.

### Loading and error states

Every fetch goes through `useFetch`, which tracks `loading`, `error`, and `data` and cancels in-flight requests on unmount. Each screen renders all four states: loading spinner, error box with a retry button, empty state, and content. Network failures (backend not running) produce a specific message naming the URL it tried.

---

## Notes

- **Images** come from Unsplash. `SafeImage` falls back to an inline placeholder if a URL fails, so a rate-limited image never shows a broken icon.
- **Responsive** from 360 px up. The details page collapses to one column below 900 px and the booking card moves above the description; the header search pill drops to its own row below 768 px.
- **Not built yet:** the admin/host dashboard.
