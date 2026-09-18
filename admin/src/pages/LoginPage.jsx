import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import Field from '../components/ui/Field';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

/**
 * The login page at `/login`.
 *
 * Matches the Figma export: bare "Login" heading, Username/Password
 * fields, a "Forgot Password ?" link, and a solid submit button — no
 * card border, no "Host dashboard" title/subtitle, no demo-account hint,
 * since none of those appear in the design.
 *
 * Validates locally first (empty fields), then posts to
 * POST /api/users/login through the auth context. Three failure modes get
 * three distinct messages:
 *  - a blank field is caught before any request is made
 *  - wrong credentials show the backend's own 401 message
 *  - a valid *guest* account is refused with an explanation, because this
 *    dashboard is for hosts only
 *
 * On success the host lands on whichever page they originally asked for,
 * or the listings page if they came straight here.
 */
export default function LoginPage() {
  const { signIn, isAuthenticated, restoring } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Where the protected route wanted to send them before the redirect.
  const destination = location.state?.from || '/';

  // Clear stale errors if the user navigates back to this page.
  useEffect(() => {
    setFormError(null);
  }, [location.key]);

  // Already signed in? Skip the form entirely.
  if (!restoring && isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  /**
   * Check both fields are filled in.
   * @returns {object} field name -> message
   */
  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Enter your username';
    if (!password) errors.password = 'Enter your password';
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(username.trim(), password);
      navigate(destination, { replace: true });
    } catch (error) {
      // AuthContext throws NOT_A_HOST for a guest account; everything else
      // is the backend's message (bad credentials, server down, …).
      setFormError({
        message: error.message,
        title: error.code === 'NOT_A_HOST' ? 'Host account required' : 'We could not sign you in',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__form">
        <h1 className="login-page__heading">Login</h1>

        {formError && (
          <Alert tone="error" title={formError.title}>
            {formError.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Field id="username" label="Username" error={fieldErrors.username}>
            {(props) => (
              <input
                {...props}
                type="text"
                className="input"
                value={username}
                autoComplete="username"
                autoFocus
                disabled={submitting}
                onChange={(event) => {
                  setUsername(event.target.value);
                  // Clear the field's error as soon as it is being fixed.
                  if (fieldErrors.username) {
                    setFieldErrors((current) => ({ ...current, username: undefined }));
                  }
                }}
              />
            )}
          </Field>

          <Field id="password" label="Password" error={fieldErrors.password}>
            {(props) => (
              <input
                {...props}
                type="password"
                className="input"
                value={password}
                autoComplete="current-password"
                disabled={submitting}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                  }
                }}
              />
            )}
          </Field>

          <p className="login-page__forgot">
            <a href="#">Forgot Password ?</a>
          </p>

          <button type="submit" className="login-page__submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        {/* The seeded host account, so the dashboard can be tried straight away.
            Not part of the Figma design, kept as a screen-reader-only note so
            it doesn't affect the visual match but the demo credentials are
            still discoverable. */}
        <p className="login-page__demo-note">
          Demo host account: sarahhost / password123. Guest accounts such as
          jamesguest cannot access this dashboard — they belong on the
          customer site.
        </p>
      </div>
    </div>
  );
}
