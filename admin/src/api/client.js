/**
 * Thin wrapper around fetch for talking to the backend API.
 *
 * Every request the dashboard makes goes through here, so switching
 * environments is a one-line change in .env (VITE_API_URL) and no component
 * builds a URL or sets an auth header by hand.
 */

// Falls back to the local backend so the app still runs if .env is missing.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Perform a request and unwrap the JSON response.
 *
 * Non-2xx responses become thrown Errors carrying the backend's own
 * `message`, its `status`, and any `errors` array from a validation
 * failure — so a form can map server-side problems back onto fields.
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
    // fetch only rejects on network-level problems — server down, DNS
    // failure, CORS rejection. Name the URL so the cause is obvious.
    throw new Error(
      `Could not reach the API at ${API_URL}. Check that the backend is running.`
    );
  }

  // 204s and empty bodies would break JSON.parse, so guard it.
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    // Field-level validation problems from POST/PUT /accommodations.
    error.details = data?.errors;
    throw error;
  }

  return data;
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

/** Exchange credentials for a JWT. */
export const login = (username, password) =>
  request('/users/login', { method: 'POST', body: { username, password } });

/** Fetch the token owner's profile — used to restore a session on refresh. */
export const getMe = (token) => request('/users/me', { token });

/* ------------------------------------------------------------------ */
/* Accommodations                                                      */
/* ------------------------------------------------------------------ */

/**
 * List accommodations.
 *
 * The API has no "only my listings" filter, so the dashboard requests a
 * full page and narrows to the logged-in host's own listings client-side
 * (see ListingsPage).
 *
 * @param {object} [params] - query parameters, e.g. { limit: 100 }
 */
export const getAccommodations = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  ).toString();

  return request(`/accommodations${query ? `?${query}` : ''}`);
};

/** Fetch a single accommodation — used to pre-fill the edit form. */
export const getAccommodation = (id) => request(`/accommodations/${id}`);

/** Create a listing. The backend sets host/host_id from the token. */
export const createAccommodation = (listing, token) =>
  request('/accommodations', { method: 'POST', body: listing, token });

/** Update a listing. Owner only — the backend enforces it. */
export const updateAccommodation = (id, listing, token) =>
  request(`/accommodations/${id}`, { method: 'PUT', body: listing, token });

/** Delete a listing. Owner only. */
export const deleteAccommodation = (id, token) =>
  request(`/accommodations/${id}`, { method: 'DELETE', token });

/* ------------------------------------------------------------------ */
/* Reservations                                                        */
/* ------------------------------------------------------------------ */

/** Every reservation made against the logged-in host's listings. */
export const getHostReservations = (token) => request('/reservations/host', { token });
