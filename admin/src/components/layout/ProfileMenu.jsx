import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * The account control at the right of the header.
 *
 * Matches the Figma export: the signed-in host's name as plain text (no
 * "Hi," greeting), then a hamburger icon + generic avatar-circle grouped
 * inside a bordered pill — clicking it still opens the same
 * "View reservations" / "Log out" dropdown as before.
 * Logged out, it shows a "Become a host" link alongside the login action.
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
      <span className="profile__name">{user.username}</span>

      <button
        type="button"
        className="profile__trigger"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="profile__hamburger">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
        <span className="profile__avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>
        </span>
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
