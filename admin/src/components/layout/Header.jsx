import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../../context/AuthContext';

/**
 * The sticky top bar shown on every page.
 *
 * Matches the Figma export's two-row layout: logo + account control on
 * top, then a separate row of outlined nav pills below — none of them
 * shown as "active" in the export, so all three share one plain style.
 * On /login specifically, the export shows just the bare logo — no
 * account control, since you're already on the sign-in screen.
 */
export default function Header() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';
  // The Create/Edit Listing frames show a single "View my listings" link in
  // place of the usual three-pill nav — you're already mid-form, so the
  // other two destinations (Reservations, Create Listing itself) don't apply.
  const isListingFormPage =
    pathname === '/listings/new' || /^\/listings\/[^/]+\/edit$/.test(pathname);

  return (
    <header className="header">
      <div className="header__top">
        <Logo />
        {!isLoginPage && <ProfileMenu />}
      </div>

      {isAuthenticated && (
        <nav className="header__nav" aria-label="Dashboard">
          {isListingFormPage ? (
            <NavLink to="/" end className="header__link">
              View my listings
            </NavLink>
          ) : (
            <>
              <NavLink to="/reservations" className="header__link">
                View Reservations
              </NavLink>
              <NavLink to="/" end className="header__link">
                View Listings
              </NavLink>
              <NavLink to="/listings/new" className="header__link">
                Create Listing
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
