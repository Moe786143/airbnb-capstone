import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../../context/AuthContext';

/**
 * The sticky top bar shown on every page.
 *
 * Matches the Figma export's two-row layout: logo + account control on
 * top, then a separate row of outlined nav pills below — none of them
 * shown as "active" in the export, so all three share one plain style.
 */
export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header__top">
        <Logo />
        <ProfileMenu />
      </div>

      {isAuthenticated && (
        <nav className="header__nav" aria-label="Dashboard">
          <NavLink to="/reservations" className="header__link">
            View Reservations
          </NavLink>
          <NavLink to="/" end className="header__link">
            View Listings
          </NavLink>
          <NavLink to="/listings/new" className="header__link">
            Create Listing
          </NavLink>
        </nav>
      )}
    </header>
  );
}
