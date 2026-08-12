import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/client';

/**
 * localStorage key holding the JWT between page loads.
 * Deliberately different from the customer app's key so the two apps do not
 * share or clobber each other's session when served from the same origin.
 */
const TOKEN_KEY = 'airbnb_admin_token';

/** Shown when a non-host account tries to sign in. */
export const NOT_A_HOST_MESSAGE =
  'This dashboard is for hosts only. That account is registered as a guest — ' +
  'sign in with a host account to manage listings.';

const AuthContext = createContext(null);

/**
 * Application-wide authentication state for the dashboard.
 *
 * Beyond the usual token handling it enforces one extra rule: only accounts
 * with the `host` role are allowed in. A guest account is rejected at login
 * and, if a guest's token somehow reaches storage, discarded on restore.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  // True until the stored token has been checked. Protected routes wait on
  // this instead of bouncing a signed-in host to the login page on refresh.
  const [restoring, setRestoring] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  /**
   * On mount, trade any stored token for the matching profile. An expired
   * token, a deleted user, or a non-host account all result in the stored
   * token being cleared.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setRestoring(false);
      return undefined;
    }

    let cancelled = false;

    api
      .getMe(storedToken)
      .then((profile) => {
        if (cancelled) return;

        if (profile.role !== 'host') {
          // A guest token must never unlock the dashboard.
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          return;
        }

        setUser(profile);
        setToken(storedToken);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Log in with credentials and persist the session.
   *
   * Rejects non-host accounts before storing anything, so a guest signing in
   * here never ends up half-authenticated.
   *
   * @throws {Error} with the backend's message, or NOT_A_HOST_MESSAGE
   * @returns {Promise<object>} the logged-in host
   */
  const signIn = useCallback(async (username, password) => {
    const data = await api.login(username, password);

    if (data.role !== 'host') {
      const error = new Error(NOT_A_HOST_MESSAGE);
      error.code = 'NOT_A_HOST';
      throw error;
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ _id: data._id, username: data.username, role: data.role });
    return data;
  }, []);

  /** Clear the session — token, user, and the stored copy. */
  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      restoring,
      isAuthenticated: Boolean(token && user),
      signIn,
      signOut,
    }),
    [user, token, restoring, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Read the auth context. Throws when used outside the provider, turning a
 * confusing null-reference crash into an explanatory error.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
