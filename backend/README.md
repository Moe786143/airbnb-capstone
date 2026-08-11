# Airbnb Capstone — Backend API

REST API for the Airbnb clone capstone project. Built with **Node.js**, **Express**, **MongoDB / Mongoose**, and **JWT** authentication.

---

## Table of contents

- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Seeding the database](#seeding-the-database)
- [Project structure](#project-structure)
- [Authentication](#authentication)
- [Data models](#data-models)
- [API reference](#api-reference)
  - [Users](#users)
  - [Accommodations](#accommodations)
  - [Reservations](#reservations)
  - [Health](#health)
- [Error format & status codes](#error-format--status-codes)

---

## Getting started

```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your values
npm run seed              # optional: load sample data
npm run dev               # development, auto-restart via nodemon
# or
npm start                 # production
```

The server starts on `http://localhost:5000` by default. It will not start if `MONGO_URI` or `JWT_SECRET` is missing, or if MongoDB is unreachable.

**Requirements:** Node.js 18+, and either a local MongoDB instance or a MongoDB Atlas connection string.

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | no | `5000` | Port the server listens on |
| `MONGO_URI` | **yes** | — | MongoDB connection string |
| `JWT_SECRET` | **yes** | — | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | no | `7d` | Token lifetime (`60s`, `24h`, `7d`) |
| `CLIENT_URL` | no | `*` | Origin allowed by CORS |

---

## Seeding the database

```bash
npm run seed
```

**This wipes the `users`, `accommodations` and `reservations` collections**, then inserts 2 users and 8 accommodations.

| Username | Password | Role |
|---|---|---|
| `sarahhost` | `password123` | `host` |
| `jamesguest` | `password123` | `user` |

All 8 listings are owned by `sarahhost`. Log in as `jamesguest` to make bookings against them.

---

## Project structure

```
backend/
├── controllers/
│   ├── accommodationController.js   # listing CRUD + filtering
│   ├── reservationController.js     # booking create/read/cancel
│   └── userController.js            # register, login, profile
├── models/
│   ├── Accommodation.js
│   ├── Reservation.js
│   └── User.js                      # bcrypt hashing hook
├── routes/
│   ├── accommodationRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── middleware/
│   └── auth.js                      # protect (JWT) + restrictTo (roles)
├── seed.js                          # sample data script
├── server.js                        # app entry point
├── .env.example
└── README.md
```

---

## Authentication

Protected endpoints require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Get a token from `POST /api/users/register` or `POST /api/users/login`. The middleware verifies the signature, re-loads the user from the database (so a deleted account's token stops working immediately), and attaches the user to `req.user`.

Failures return **401** (missing/invalid/expired token, or the user no longer exists) or **403** (authenticated but not permitted, e.g. a `user` trying to create a listing, or editing someone else's listing).

---

## Data models

### User

| Field | Type | Notes |
|---|---|---|
| `username` | String | required, unique, min 3 chars |
| `password` | String | required, min 6, bcrypt-hashed, **never returned** |
| `role` | String | `'user'` or `'host'`, default `'user'` |

### Accommodation

| Field | Type | Notes |
|---|---|---|
| `images` | [String] | image URLs |
| `type` | String | required, e.g. `"Entire loft"` |
| `location` | String | required, indexed |
| `guests` | Number | required, min 1 |
| `bedrooms` / `bathrooms` | Number | required |
| `amenities` | [String] | |
| `rating` | Number | 0–5 |
| `reviews` | Number | review count |
| `price` | Number | required, per night |
| `title` | String | required |
| `host` | String | host's username (set from token) |
| `host_id` | ObjectId → User | set from token |
| `weeklyDiscount` | Number | percent off for stays ≥ 7 nights |
| `cleaningFee` / `serviceFee` / `occupancyTaxes` | Number | one-off charges |
| `enhancedCleaning` / `selfCheckIn` | Boolean | |
| `description` | String | |
| `specificRatings` | Object | `cleanliness`, `communication`, `checkIn`, `accuracy`, `location`, `value` |

### Reservation

| Field | Type | Notes |
|---|---|---|
| `accommodation_id` | ObjectId → Accommodation | required |
| `user_id` | ObjectId → User | the guest, set from token |
| `host_id` | ObjectId → User | copied from the listing |
| `checkIn` / `checkOut` | Date | `checkOut` must be after `checkIn` |
| `guests` | Number | min 1, cannot exceed listing capacity |
| `totalCost` | Number | **calculated server-side** |
| `createdAt` | Date | defaults to now |

**Total cost formula:**

```
(price × nights) − weekly discount + cleaningFee + serviceFee + occupancyTaxes
```

The weekly discount applies only to stays of 7 nights or more. A `totalCost` sent in the request body is ignored.

---

## API reference

Base URL: `http://localhost:5000`

### Users

---

#### `POST /api/users/register`

Create an account. Public. Returns a token, so the client is logged in immediately.

**Body**

```json
{
  "username": "jamesguest",
  "password": "password123",
  "role": "user"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | String | yes | min 3 chars, must be unique |
| `password` | String | yes | min 6 chars |
| `role` | String | no | `'user'` or `'host'`, defaults to `'user'` |

**Response `201`**

```json
{
  "_id": "66b1f0c2e4b0a1234567890a",
  "username": "jamesguest",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:** `400` missing/invalid fields · `409` username taken · `500`

---

#### `POST /api/users/login`

Exchange credentials for a JWT. Public.

**Body**

```json
{
  "username": "sarahhost",
  "password": "password123"
}
```

**Response `200`**

```json
{
  "_id": "66b1f0c2e4b0a12345678901",
  "username": "sarahhost",
  "role": "host",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:** `400` missing username or password · `401` invalid credentials · `500`

> The `401` message is identical whether the username does not exist or the password is wrong, so the endpoint cannot be used to discover valid usernames.

---

#### `GET /api/users/me`

Return the logged-in user's profile. **Protected.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`**

```json
{
  "_id": "66b1f0c2e4b0a12345678901",
  "username": "sarahhost",
  "role": "host"
}
```

**Errors:** `401` · `500`

---

### Accommodations

---

#### `POST /api/accommodations`

Create a listing. **Protected — `host` role only.** The `host` and `host_id` fields are taken from the token; any values sent in the body are ignored.

**Headers:** `Authorization: Bearer <token>`

**Body**

```json
{
  "title": "Sunlit Loft in the Marais",
  "type": "Entire loft",
  "location": "Paris, France",
  "images": ["https://example.com/1.jpg"],
  "guests": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "amenities": ["Wifi", "Kitchen"],
  "price": 165,
  "rating": 4.92,
  "reviews": 178,
  "weeklyDiscount": 12,
  "cleaningFee": 45,
  "serviceFee": 32,
  "occupancyTaxes": 21,
  "enhancedCleaning": true,
  "selfCheckIn": true,
  "description": "A bright top-floor loft...",
  "specificRatings": {
    "cleanliness": 4.9, "communication": 5.0, "checkIn": 4.9,
    "accuracy": 4.8, "location": 5.0, "value": 4.7
  }
}
```

**Required:** `title`, `type`, `location`, `price`, `guests`, `bedrooms`, `bathrooms`. Everything else is optional and defaults sensibly.

**Response `201`** — the created accommodation document, including `_id`, `host`, `host_id` and `createdAt`.

**Errors:** `400` validation failed (response includes an `errors` array) · `401` · `403` not a host · `500`

---

#### `GET /api/accommodations`

List accommodations. Public.

**Query parameters** (all optional)

| Param | Example | Description |
|---|---|---|
| `location` | `?location=paris` | case-insensitive partial match |
| `type` | `?type=Entire%20loft` | case-insensitive exact match |
| `guests` | `?guests=4` | minimum capacity |
| `minPrice` | `?minPrice=100` | inclusive lower bound |
| `maxPrice` | `?maxPrice=300` | inclusive upper bound |
| `sort` | `?sort=-rating` | `price`, `-price`, `rating`, `-rating`, `createdAt`, `-createdAt` |
| `page` | `?page=2` | 1-based, default `1` |
| `limit` | `?limit=10` | default `20`, max `100` |

Filters combine: `GET /api/accommodations?location=california&guests=2&maxPrice=300&sort=price`

**Response `200`**

```json
{
  "count": 2,
  "total": 2,
  "page": 1,
  "pages": 1,
  "accommodations": [ { "_id": "...", "title": "...", "price": 245, "...": "..." } ]
}
```

**Errors:** `400` non-numeric `guests` / `minPrice` / `maxPrice` · `500`

---

#### `GET /api/accommodations/:id`

Fetch one listing. Public.

**Response `200`** — the full accommodation document.

**Errors:** `400` malformed id · `404` not found · `500`

---

#### `PUT /api/accommodations/:id`

Update a listing. **Protected — owner only.** Partial updates are allowed; send only the fields you want to change. `host`, `host_id` and `_id` are stripped from the body, so ownership cannot be transferred through this route.

**Headers:** `Authorization: Bearer <token>`

**Body** (example)

```json
{ "price": 185, "selfCheckIn": false }
```

**Response `200`** — the updated accommodation document.

**Errors:** `400` malformed id or validation failed · `401` · `403` not the owner · `404` · `500`

---

#### `DELETE /api/accommodations/:id`

Delete a listing. **Protected — owner only.**

**Response `200`**

```json
{ "message": "Accommodation deleted successfully", "id": "66b1f0c2e4b0a12345678902" }
```

**Errors:** `400` malformed id · `401` · `403` not the owner · `404` · `500`

---

### Reservations

All reservation endpoints are **protected**.

---

#### `POST /api/reservations`

Book a listing for the logged-in user.

**Headers:** `Authorization: Bearer <token>`

**Body**

```json
{
  "accommodation_id": "66b1f0c2e4b0a12345678902",
  "checkIn": "2026-09-01",
  "checkOut": "2026-09-08",
  "guests": 2
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `accommodation_id` | ObjectId | yes | must exist |
| `checkIn` | Date | yes | ISO date string |
| `checkOut` | Date | yes | must be after `checkIn` |
| `guests` | Number | yes | min 1, ≤ the listing's capacity |

`user_id`, `host_id` and `totalCost` are all derived server-side and cannot be set by the client.

**Response `201`**

```json
{
  "_id": "66b1f0c2e4b0a12345678903",
  "accommodation_id": "66b1f0c2e4b0a12345678902",
  "user_id": "66b1f0c2e4b0a1234567890a",
  "host_id": "66b1f0c2e4b0a12345678901",
  "checkIn": "2026-09-01T00:00:00.000Z",
  "checkOut": "2026-09-08T00:00:00.000Z",
  "guests": 2,
  "totalCost": 1156.4,
  "createdAt": "2026-08-10T12:00:00.000Z"
}
```

**Errors:**

| Code | Cause |
|---|---|
| `400` | missing fields, invalid dates, `checkOut` ≤ `checkIn`, too many guests, or booking your own listing |
| `401` | not authenticated |
| `404` | accommodation not found |
| `409` | those dates overlap an existing reservation |
| `500` | server error |

> Same-day turnover is allowed: a stay that starts on the day another ends does not count as a conflict.

---

#### `GET /api/reservations/host`

Every reservation made against listings owned by the logged-in host, newest first.

**Headers:** `Authorization: Bearer <token>`

**Response `200`**

```json
{
  "count": 1,
  "reservations": [
    {
      "_id": "66b1f0c2e4b0a12345678903",
      "accommodation_id": {
        "_id": "66b1f0c2e4b0a12345678902",
        "title": "Sunlit Loft in the Marais",
        "location": "Paris, France",
        "images": ["https://example.com/1.jpg"],
        "price": 165,
        "type": "Entire loft"
      },
      "user_id": { "_id": "66b1f0c2e4b0a1234567890a", "username": "jamesguest" },
      "checkIn": "2026-09-01T00:00:00.000Z",
      "checkOut": "2026-09-08T00:00:00.000Z",
      "guests": 2,
      "totalCost": 1156.4,
      "createdAt": "2026-08-10T12:00:00.000Z"
    }
  ]
}
```

Returns `{ "count": 0, "reservations": [] }` when the host has no bookings.

**Errors:** `401` · `500`

---

#### `GET /api/reservations/user`

Every reservation the logged-in user has made as a guest, newest first. Same shape as `/host`, but with `host_id` populated (`{ _id, username }`) instead of `user_id`.

**Errors:** `401` · `500`

---

#### `DELETE /api/reservations/:id`

Cancel a reservation. Either party may cancel it: the guest who booked it, or the host of the listing.

**Response `200`**

```json
{ "message": "Reservation cancelled successfully", "id": "66b1f0c2e4b0a12345678903" }
```

**Errors:** `400` malformed id · `401` · `403` neither the guest nor the host · `404` · `500`

---

### Health

#### `GET /api/health`

Liveness probe. Public.

**Response `200`**

```json
{ "status": "ok", "database": "connected" }
```

---

## Error format & status codes

Every error is JSON with a `message` field:

```json
{ "message": "Accommodation not found" }
```

Validation failures on `POST /api/accommodations` and `PUT /api/accommodations/:id` add an `errors` array:

```json
{
  "message": "Validation failed",
  "errors": ["title is required", "price cannot be negative"]
}
```

`500` responses include an `error` field with the underlying message to help with debugging.

| Code | Meaning |
|---|---|
| `200` | OK — successful read, update or delete |
| `201` | Created — new user, accommodation or reservation |
| `400` | Bad request — missing/invalid input, malformed ObjectId |
| `401` | Unauthorized — missing, invalid or expired token |
| `403` | Forbidden — authenticated, but not allowed to do this |
| `404` | Not found — no such resource or route |
| `409` | Conflict — username taken, or dates already booked |
| `500` | Server error |

---

## Quick test with curl

```bash
# 1. Log in as the seeded host
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sarahhost","password":"password123"}' | jq -r .token)

# 2. Browse listings in California
curl "http://localhost:5000/api/accommodations?location=california"

# 3. See the reservations on your listings
curl http://localhost:5000/api/reservations/host -H "Authorization: Bearer $TOKEN"
```
