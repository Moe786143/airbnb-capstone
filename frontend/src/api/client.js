/**
 * Thin wrapper around fetch for talking to the backend API.
 *
 * Everything the app knows about the server lives here, so switching
 * environments is a one-line change in .env (VITE_API_URL) and no component
 * ever needs to build a URL or set an auth header by hand.
 */

// Falls back to the local backend so the app still runs if .env is missing.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Perform a request against the API and unwrap the JSON response.
 *
 * Any non-2xx status is turned into a thrown Error carrying the backend's
 * own `message` field, so callers can show a meaningful message instead of
 * a generic failure. Network failures are caught and reported as such.
 *
 * @param {string} path - path after the base URL, e.g. '/accommodations'
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {object} [options.body] - serialised to JSON when present
 * @param {string} [options.token] - JWT sent as `Authorization: Bearer <token>`
 * @returns {Promise<any>} the parsed JSON body
 */
async function request(path, { method = 'GET', body, token } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    // fetch only rejects on network-level problems — the server being down,
    // DNS failure, CORS rejection. Give the user something actionable.
    throw new Error(
      'Could not reach the server. Check that the backend is running on ' +
        API_URL.replace('/api', '') +
        '.'
    );
  }

  // 204s and empty bodies would blow up JSON.parse, so guard the parse.
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    // Validation errors from the backend arrive as an array of strings.
    error.details = data?.errors;
    throw error;
  }

  return data;
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

/**
 * Exchange credentials for a JWT.
 * @returns {Promise<{_id: string, username: string, role: string, token: string}>}
 */
export const login = (username, password) =>
  request('/users/login', { method: 'POST', body: { username, password } });

/**
 * Fetch the profile of the token's owner. Used on page load to restore a
 * session, and to detect a token that has expired or been revoked.
 */
export const getMe = (token) => request('/users/me', { token });

/* ------------------------------------------------------------------ */
/* Accommodations                                                      */
/* ------------------------------------------------------------------ */

/**
 * List accommodations, optionally filtered.
 * @param {object} [params] - e.g. { location: 'Paris', limit: 20 }
 * @returns {Promise<{count, total, page, pages, accommodations}>}
 */
export const getAccommodations = (params = {}) => {
  // Drop empty values so we never send `?location=` with nothing after it.
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  ).toString();

  return request(`/accommodations${query ? `?${query}` : ''}`);
};

/** Fetch a single accommodation by id. */
export const getAccommodation = (id) => request(`/accommodations/${id}`);

/* ------------------------------------------------------------------ */
/* Reservations                                                        */
/* ------------------------------------------------------------------ */

/**
 * Book a stay. The backend derives host_id and totalCost itself, so only
 * these four fields are sent.
 */
export const createReservation = (reservation, token) =>
  request('/reservations', { method: 'POST', body: reservation, token });

/** Every reservation the logged-in user has made as a guest. */
export const getUserReservations = (token) => request('/reservations/user', { token });

/**
 * Cancel a reservation. The backend allows either party to cancel — the
 * guest who booked it or the host of the listing — and returns
 * `{ message, id }` on success.
 */
export const deleteReservation = (id, token) =>
  request(`/reservations/${id}`, { method: 'DELETE', token });
