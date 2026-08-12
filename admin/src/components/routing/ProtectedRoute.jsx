import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../ui/Spinner';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for every dashboard page.
 *
 * Three cases:
 *  - still checking the stored token: show a spinner, so a signed-in host
 *    refreshing the page is not bounced to the login screen mid-check
 *  - no valid session: redirect to /login, remembering where they were
 *    heading so the login page can send them back there
 *  - signed in as a host: render the page
 *
 * The role check lives in AuthContext, which refuses to hold a session for
 * a non-host account, so `isAuthenticated` here already implies "is a host".
 */
export default function ProtectedRoute() {
  const { isAuthenticated, restoring } = useAuth();
  const location = useLocation();

  if (restoring) {
    return (
      <div className="page">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
