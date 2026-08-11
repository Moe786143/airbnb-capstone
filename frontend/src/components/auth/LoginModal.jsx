import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';

/**
 * Login dialog.
 *
 * Posts to POST /api/users/login through the auth context, which stores the
 * returned JWT. Shows a submitting state on the button and surfaces the
 * backend's own error message (e.g. "Invalid username or password") inline.
 *
 * Its open/closed state lives in AuthContext so that the cost calculator
 * can trigger it as well as the header.
 */
export default function LoginModal() {
  const { isLoginOpen, closeLogin, signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset the form each time the dialog opens so a previous error or a
  // half-typed password never carries over.
  useEffect(() => {
    if (isLoginOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setSubmitting(false);
    }
  }, [isLoginOpen]);

  /** Validate locally, then attempt the login. */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError('Please enter both your username and password.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signIn(username.trim(), password);
      // On success the context closes the dialog for us.
    } catch (err) {
      setError(err.message || 'Could not log you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={isLoginOpen} onClose={closeLogin} title="Log in">
      <h3 className="auth__welcome">Welcome to Airbnb</h3>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Stacked inputs sharing one border, the way Airbnb's own form looks */}
        <div className="auth-form__group">
          <label className="auth-form__field">
            <span className="auth-form__label">Username</span>
            <input
              type="text"
              className="auth-form__input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              disabled={submitting}
            />
          </label>
          <label className="auth-form__field">
            <span className="auth-form__label">Password</span>
            <input
              type="password"
              className="auth-form__input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={submitting}
            />
          </label>
        </div>

        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Continue'}
        </button>
      </form>

      {/* The seeded accounts, so a marker or a first-time visitor can get in */}
      <div className="auth__hint">
        <p className="auth__hint-title">Demo accounts</p>
        <p>
          <strong>jamesguest</strong> / password123 — guest
        </p>
        <p>
          <strong>sarahhost</strong> / password123 — host
        </p>
      </div>
    </Modal>
  );
}
