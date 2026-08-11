import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * The profile control at the right of the header.
 *
 * Logged out, it is a "Log in" button that opens the login dialog. Logged
 * in, it shows the username with an avatar and a dropdown containing
 * "View reservations" and "Log out".
 *
 * @param {Function} onViewReservations - opens the reservations dialog
 */
export default function ProfileMenu({ onViewReservations }) {
  const { user, isAuthenticated, restoring, openLogin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the dropdown on an outside click or on Escape — standard menu
  // behaviour that users expect.
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

  // While the stored token is being validated, show a neutral placeholder
  // rather than flashing "Log in" at a user who is actually signed in.
  if (restoring) {
    return <div className="profile-menu__placeholder" aria-hidden="true" />;
  }

  if (!isAuthenticated) {
    return (
      <button type="button" className="profile-trigger" onClick={openLogin}>
        <span className="profile-trigger__burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="profile-trigger__label">Log in</span>
      </button>
    );
  }

  return (
    <div className="profile-menu" ref={containerRef}>
      <button
        type="button"
        className="profile-trigger"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="profile-trigger__burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {/* Initial-only avatar keeps the header light without needing images */}
        <span className="profile-trigger__avatar">
          {user.username.charAt(0).toUpperCase()}
        </span>
        <span className="profile-trigger__label">{user.username}</span>
      </button>

      {open && (
        <ul className="profile-dropdown" role="menu">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="profile-dropdown__item profile-dropdown__item--bold"
              onClick={() => {
                setOpen(false);
                onViewReservations();
              }}
            >
              View reservations
            </button>
          </li>
          <li role="none" className="profile-dropdown__divider" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="profile-dropdown__item"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              Log out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
