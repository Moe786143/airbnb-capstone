import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/client';

/** localStorage key holding the JWT between page loads. */
const TOKEN_KEY = 'airbnb_token';

const AuthContext = createContext(null);

/**
 * Application-wide authentication state.
 *
 * Holds the JWT and the logged-in user, restores the session on a page
 * refresh by validating the stored token against GET /api/users/me, and
 * owns the open/closed state of the login modal so that any component
 * (the header, the cost calculator) can prompt for a login.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  // True until the stored token has been checked, so the header can avoid
  // flashing "Log in" at a user who is in fact still signed in.
  const [restoring, setRestoring] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [isLoginOpen, setLoginOpen] = useState(false);

  /**
   * On mount, trade any stored token for the matching profile. A token that
   * has expired or whose user was deleted returns 401, and we clear it so
   * the app falls back to the logged-out state cleanly.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setRestoring(false);
      return;
    }

    let cancelled = false;

    api
      .getMe(storedToken)
      .then((profile) => {
        if (cancelled) return;
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

    // Guards against setting state after unmount in React's strict-mode
    // double render.
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Log in with credentials, persist the token and store the profile.
   * Errors are re-thrown so the login form can display them.
   *
   * @returns {Promise<object>} the logged-in user
   */
  const signIn = useCallback(async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ _id: data._id, username: data.username, role: data.role });
    setLoginOpen(false);
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
      // Login modal controls, shared so the cost calculator can open it too.
      isLoginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
    }),
    [user, token, restoring, isLoginOpen, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Read the auth context. Throws when used outside the provider, which turns
 * a confusing null-reference crash into an explanatory error.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
