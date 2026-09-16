import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/routing/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import ReservationsPage from './pages/ReservationsPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Application root.
 *
 * Wraps everything in the auth provider and the router, renders the header
 * on every page, and puts every dashboard route behind <ProtectedRoute> —
 * only /login is reachable without a valid host session.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <main className="site-main">
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Everything below requires a signed-in host */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ListingsPage />} />
              <Route path="/listings/new" element={<CreateListingPage />} />
              <Route path="/listings/:id/edit" element={<EditListingPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
