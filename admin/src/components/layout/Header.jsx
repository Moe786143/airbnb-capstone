import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../../context/AuthContext';

/**
 * The sticky top bar shown on every page.
 *
 * Logo on the left, the dashboard's navigation in the middle, and the
 * account control on the right. The nav is hidden when logged out, since
 * every destination behind it is a protected route.
 */
export default function Header() {
  const { isAuthenticated } = useAuth();

  // NavLink sets `isActive` for us; this turns it into the class name.
  const linkClass = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`;

  return (
    <header className="header">
      <div className="header__inner">
        <Logo />

        {isAuthenticated && (
          <nav className="header__nav" aria-label="Dashboard">
            <NavLink to="/" end className={linkClass}>
              Listings
            </NavLink>
            <NavLink to="/listings/new" className={linkClass}>
              Create listing
            </NavLink>
            <NavLink to="/reservations" className={linkClass}>
              Reservations
            </NavLink>
          </nav>
        )}

        <ProfileMenu />
      </div>
    </header>
  );
}
