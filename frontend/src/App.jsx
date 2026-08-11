import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CopyrightFooter from './components/layout/CopyrightFooter';
import ScrollToTop from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import LocationsPage from './pages/LocationsPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Application root.
 *
 * Wraps everything in the auth provider (so any component can read the
 * session or open the login dialog) and the router, then renders the shared
 * chrome — header above, footers below — around the three routes.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header />

        <main className="site-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:id" element={<LocationDetailsPage />} />
            {/* Anything else falls through to the not-found page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <CopyrightFooter />
      </BrowserRouter>
    </AuthProvider>
  );
}
