import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import HeaderSearch from './HeaderSearch';
import StartSearchPill from './StartSearchPill';
import ProfileMenu from './ProfileMenu';
import ReservationsModal from './ReservationsModal';
import LoginModal from '../auth/LoginModal';

/**
 * The three tabs shown on the home page's dark nav. "Places to stay" is
 * the real home route. "Experiences" and "Online Experiences" render as
 * plain buttons rather than links — clickable, with the same hover
 * feedback as the active tab, but there's no page behind them yet, so
 * they don't navigate anywhere.
 */
const HOME_NAV_TABS = [
  { label: 'Places to stay', to: '/' },
  { label: 'Experiences' },
  { label: 'Online Experiences' },
];
// The dark tabbed nav still applies to /experiences and /online-experiences
// if either is reached directly by URL, even though the tabs above no
// longer link to them.
const HOME_NAV_ROUTES = ['/', '/experiences', '/online-experiences'];

/** Matches a listing detail page (`/locations/:id`), but not the results
 * page itself (`/locations`) — that one keeps the destination/guests pill. */
const DETAIL_NAV_PATTERN = /^\/locations\/[^/]+$/;

/**
 * The sticky top bar shown on every page.
 *
 * On the home page and its two sibling tabs (Experiences, Online
 * Experiences) it renders as the dark, tabbed nav from the Figma homepage
 * frame (logo, section tabs, "Become a host", a globe, and an icon-only
 * profile control) so the three stay switchable as one nav rather than
 * flipping styles between them. On a listing detail page it renders the
 * light nav from the Figma listing frame — logo, a collapsed "Start your
 * search" pill, "Become a Host", a globe, and an icon-only profile control.
 * Every other page keeps the original light header — logo, the destination
 * search pill, and the profile control with its label.
 *
 * It also hosts the two dialogs that can be opened from anywhere — login
 * and reservations — so they sit above the rest of the page in the DOM.
 */
export default function Header() {
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const { pathname } = useLocation();
  const isHomeNav = HOME_NAV_ROUTES.includes(pathname);
  const isDetailNav = !isHomeNav && DETAIL_NAV_PATTERN.test(pathname);

  return (
    <>
      <header
        className={`site-header${isHomeNav ? ' site-header--home' : ''}${
          isDetailNav ? ' site-header--detail' : ''
        }`}
      >
        <div className="site-header__inner">
          <Logo />

          {isHomeNav ? (
            <>
              <nav className="home-nav__tabs" aria-label="Browse">
                {HOME_NAV_TABS.map((tab) =>
                  tab.to ? (
                    <NavLink
                      key={tab.label}
                      to={tab.to}
                      end
                      className={({ isActive }) =>
                        `home-nav__tab${isActive ? ' home-nav__tab--active' : ''}`
                      }
                    >
                      {tab.label}
                    </NavLink>
                  ) : (
                    <button type="button" key={tab.label} className="home-nav__tab">
                      {tab.label}
                    </button>
                  )
                )}
              </nav>

              <div className="site-header__right">
                <a
                  className="home-nav__host-link"
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Become a host
                </a>

                <span className="home-nav__globe" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z" />
                  </svg>
                </span>

                <ProfileMenu onViewReservations={() => setReservationsOpen(true)} compact />
              </div>
            </>
          ) : isDetailNav ? (
            <>
              <div className="site-header__center">
                <StartSearchPill />
              </div>

              <div className="site-header__right">
                <span className="site-header__host-link">Become a Host</span>

                <span className="detail-nav__globe" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z" />
                  </svg>
                </span>

                <ProfileMenu onViewReservations={() => setReservationsOpen(true)} compact />
              </div>
            </>
          ) : (
            <>
              <div className="site-header__center">
                <HeaderSearch />
              </div>

              <div className="site-header__right">
                <span className="site-header__host-link">Airbnb your home</span>
                <ProfileMenu onViewReservations={() => setReservationsOpen(true)} />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Login lives in the auth context so the cost calculator can open it */}
      <LoginModal />

      <ReservationsModal
        open={reservationsOpen}
        onClose={() => setReservationsOpen(false)}
      />
    </>
  );
}
