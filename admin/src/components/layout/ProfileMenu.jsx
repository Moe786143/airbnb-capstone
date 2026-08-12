import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * The account control at the right of the header.
 *
 * Logged in, it greets the host by name and opens a dropdown with
 * "View reservations" and "Log out". Logged out, it shows a
 * "Become a host" link alongside the login action.
 */
export default function ProfileMenu() {
  const { user, isAuthenticated, restoring, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on an outside click or Escape — standard menu behaviour.
  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // While the stored token is being checked, hold the space with a neutral
  // placeholder rather than flashing the logged-out state.
  if (restoring) {
    return <div className="profile__placeholder" aria-hidden="true" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="profile">
        <a
          className="header__link"
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
        >
          Become a host
        </a>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => navigate('/login')}>
          Log in
        </button>
      </div>
    );
  }

  /** Sign out and return to the login page. */
  const handleSignOut = () => {
    setOpen(false);
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="profile" ref={containerRef}>
      <button
        type="button"
        className="profile__trigger"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="profile__avatar" aria-hidden="true">
          {user.username.charAt(0).toUpperCase()}
        </span>
        <span className="profile__greeting">
          Hi, <strong>{user.username}</strong>
        </span>
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" className="profile__chevron">
          <path d="M2 5l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul className="dropdown" role="menu">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="dropdown__item"
              onClick={() => {
                setOpen(false);
                navigate('/reservations');
              }}
            >
              View reservations
            </button>
          </li>
          <li role="none" className="dropdown__divider" />
          <li role="none">
            <button type="button" role="menuitem" className="dropdown__item" onClick={handleSignOut}>
              Log out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
