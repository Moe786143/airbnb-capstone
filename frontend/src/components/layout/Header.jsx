import { useState } from 'react';
import Logo from './Logo';
import HeaderSearch from './HeaderSearch';
import ProfileMenu from './ProfileMenu';
import ReservationsModal from './ReservationsModal';
import LoginModal from '../auth/LoginModal';

/**
 * The sticky top bar shown on every page.
 *
 * Three regions: the logo (links home), the destination search pill, and
 * the profile control. It also hosts the two dialogs that can be opened
 * from anywhere — login and reservations — so they sit above the rest of
 * the page in the DOM.
 */
export default function Header() {
  const [reservationsOpen, setReservationsOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Logo />

          <div className="site-header__center">
            <HeaderSearch />
          </div>

          <div className="site-header__right">
            <span className="site-header__host-link">Airbnb your home</span>
            <ProfileMenu onViewReservations={() => setReservationsOpen(true)} />
          </div>
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
