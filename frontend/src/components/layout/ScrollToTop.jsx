import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window back to the top on every route change.
 *
 * Without this, clicking a listing halfway down the results page opens the
 * details page already scrolled into the middle of it — the browser keeps
 * the scroll position because the document never actually reloads.
 *
 * Renders nothing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
