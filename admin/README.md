# Airbnb Capstone — Host Admin Dashboard

The host-facing dashboard for the Airbnb clone capstone. Hosts sign in to manage their listings and see the bookings guests have made against them.

Built with **React 18**, **Vite**, and **react-router-dom**, consuming the same Express API as the customer frontend.

---

## Table of contents

- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running all three apps together](#running-all-three-apps-together)
- [Project structure](#project-structure)
- [Pages](#pages)
- [Authentication and protected routes](#authentication-and-protected-routes)
- [Form validation rules](#form-validation-rules)
- [Error handling](#error-handling)

---

## Getting started

The backend must be running first — see `../backend/README.md`.

```bash
cd admin
npm install
cp .env.example .env      # points at http://localhost:5000/api
npm run dev               # http://localhost:5174
```

Sign in with the seeded host account:

| Username | Password | Role |
|---|---|---|
| `sarahhost` | `password123` | `host` |

`sarahhost` owns all 8 seeded listings, so the dashboard has data to show immediately.

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on port **5174** with hot reload |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serve the built bundle locally |

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the backend API |

Only `VITE_`-prefixed variables are exposed to the browser. Change this one value to point the dashboard at a deployed backend — no code changes needed.

---

## Running all three apps together

| App | Port | Command |
|---|---|---|
| Backend API | 5000 | `cd backend && npm run dev` |
| Customer frontend | 3000 | `cd frontend && npm run dev` |
| Host dashboard | **5174** | `cd admin && npm run dev` |

The three run side by side against one database. A listing created here appears on the customer site on its next load, and a booking made there shows up on this dashboard's reservations page.

The two frontends store their JWTs under **different localStorage keys** (`airbnb_token` and `airbnb_admin_token`), so signing in as a guest on one does not disturb a host session on the other.

---

## Project structure

```
src/
├── api/client.js                  # every call to the backend lives here
├── components/
│   ├── layout/
│   │   ├── Header.jsx             # logo, nav, profile control
│   │   ├── Logo.jsx
│   │   └── ProfileMenu.jsx        # greeting + dropdown, or "Become a host"
│   ├── listings/
│   │   ├── ListingCard.jsx        # one listing in the grid
│   │   ├── ListingForm.jsx        # shared create/edit form
│   │   └── RepeatableInput.jsx    # add/remove rows for images & amenities
│   ├── routing/ProtectedRoute.jsx # redirects to /login without a session
│   └── ui/                        # Alert, ConfirmDialog, ErrorState, Field,
│                                  #   SafeImage, Spinner
├── context/AuthContext.jsx        # session state, host-only enforcement
├── hooks/useFetch.js              # loading / error / data for every fetch
├── pages/                         # one file per route
├── styles/                        # index, layout, forms, listings
└── utils/
    ├── format.js                  # currency, dates, night counts
    └── listing.js                 # form shape, payload mapping, validation
```

---

## Pages

### `/login` — Login

The only page reachable without a session.

- Username and password fields, both validated before any request is sent
- Posts to `POST /api/users/login` and stores the returned JWT
- On success, redirects to whichever page the host originally requested (or `/`)
- Already signed in? It redirects straight through rather than showing the form

Three failure modes, three distinct messages:

| Situation | What the host sees |
|---|---|
| Empty field | Per-field message: "Enter your username" |
| Wrong credentials | The API's own 401: "Invalid username or password" |
| Valid **guest** account | "This dashboard is for hosts only. That account is registered as a guest…" |

> **On the username field:** the API authenticates by `username`, not email, so the field is labelled Username. There is no email column in the backend's user schema.

### `/` — View listings (dashboard home)

- Fetches `GET /api/accommodations?limit=100` and shows only listings whose `host_id` matches the logged-in host
- Each card shows the main image, title, location, property type, capacity and nightly price
- **Update** opens the edit form; **Delete** opens a confirmation dialog
- Deleting calls `DELETE /api/accommodations/:id`, then re-fetches the list
- Header summarises the portfolio: property count and total nightly value
- Empty state invites the host to create their first listing
- Responsive grid: three cards across on desktop, one on a phone

> The API has no "only my listings" filter, so the dashboard requests a full page and narrows client-side. With a large database this would want a server-side `host_id` query parameter.

### `/listings/new` — Create listing

The full listing form, empty. Posts to `POST /api/accommodations` with the JWT; the backend sets `host`/`host_id` from the token, so a listing can only ever be created under your own account.

On success it redirects to the listings page with a confirmation banner naming the new listing.

### `/listings/:id/edit` — Update listing

The same form, pre-filled from `GET /api/accommodations/:id`. Submits `PUT /api/accommodations/:id`.

On success it returns to the listings page, which re-fetches on mount — so the change is visible immediately. If you open the edit URL for a listing you do not own, the page says so plainly rather than letting the save fail with a 403 after you have filled the form in.

### `/reservations` — Reservations

A table of `GET /api/reservations/host` — every booking against this host's listings, newest first.

| Column | Source |
|---|---|
| Guest | `user_id.username` (populated by the API) |
| Listing | `accommodation_id.title` + location, linking to its edit page |
| Check-in / Check-out | formatted dates |
| Nights | derived from the date range |
| Guests | `guests` |
| Total | `totalCost` |

The header shows the booking count and total booked value.

---

## Authentication and protected routes

`AuthContext` owns the session, following the same pattern as the customer frontend with one addition: **only `host` accounts are allowed in.**

- The JWT is stored in `localStorage` under `airbnb_admin_token`
- On every page load the stored token is exchanged for a profile via `GET /api/users/me`, so a refresh keeps you signed in
- A token that has expired, whose user was deleted, **or whose role is not `host`** is discarded and the app falls back to the logged-out state
- A guest account is rejected at login before anything is stored, so it can never end up half-authenticated

`ProtectedRoute` wraps every page except `/login` and handles three cases:

1. **Still checking the stored token** — shows a spinner, so a signed-in host refreshing the page is not bounced to the login screen mid-check
2. **No valid session** — redirects to `/login`, remembering the requested path so login can send them back there
3. **Signed in as a host** — renders the page

---

## Form validation rules

Validation lives in `utils/listing.js`, shared by the create and edit pages so the two can never drift apart. Errors appear after the first submit attempt and then update live as fields are corrected — the form does not turn red while it is still being filled in.

| Field | Rule |
|---|---|
| Title | Required, 5–100 characters |
| Property type | Required (dropdown) |
| Location | Required, at least 3 characters |
| Description | Optional, up to 2000 characters |
| Price per night | Required, 1–100,000 |
| Guests | Required whole number, 1–50 |
| Bedrooms | Required whole number, 0–50 |
| Bathrooms | Required, 0–50 (halves allowed) |
| Weekly discount | Optional, 0–100 % |
| Cleaning / service / occupancy fees | Optional, 0–100,000 |
| Images | At least one; each must be a full `http(s)` URL |
| Amenities | Optional; no blanks among filled rows, no duplicates |

Images and amenities are repeatable rows with add and remove buttons. Each row shows its own error underneath it, so one bad URL among six is easy to spot. The last row can be cleared but not removed, so there is always somewhere to type.

On a failed submit the form scrolls to the first problem and shows a summary banner counting the fields that need attention.

---

## Error handling

Every action reports its outcome — nothing fails silently.

| Situation | Feedback |
|---|---|
| Page loading | Spinner with a descriptive label |
| Failed page load | Error panel with the reason and a **Try again** button |
| Backend unreachable | "Could not reach the API at `<url>`. Check that the backend is running." |
| Create / update succeeded | Green banner on the listings page naming the listing |
| Create / update failed | Red banner above the form with the server's message, plus its `errors` array as a bullet list |
| Delete | Confirmation dialog naming the listing, a busy state while it runs, then a success banner — or a red banner if it fails |
| Empty result | A styled empty state with a next step, never a blank screen |

Validation errors returned by the backend are shown alongside the form's own, so a rule enforced only server-side still lands in front of the host.
