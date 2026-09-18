require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- Global middleware -----------------------------------------------------

// Allow the React frontend (a different origin in development) to call the
// API. CLIENT_URL locks this down in production; unset means allow all,
// which is convenient while developing.
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
  })
);

// Parse JSON request bodies into req.body.
app.use(express.json());

// Serve the seeded demo listing photos (backend/public/images/*) at
// /images/<file> — referenced directly by the accommodation `images` URLs.
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// --- Routes ----------------------------------------------------------------

/**
 * GET /api/health
 * Cheap liveness probe — confirms the server is up and reports whether the
 * Mongo connection is currently established.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// --- Error handling --------------------------------------------------------

/**
 * Catch-all for unmatched routes, so a typo in a URL returns a clear JSON
 * 404 instead of Express's default HTML error page.
 */
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

/**
 * Final error handler. Controllers handle their own errors, so reaching
 * here means something unexpected escaped — log it and return a generic 500.
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// --- Startup ---------------------------------------------------------------

/**
 * Connect to MongoDB, then start listening. The server does not accept
 * traffic until the database is reachable, so requests can never hit a
 * half-initialised app.
 */
const start = async () => {
  const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

  // Fail loudly and immediately on missing configuration rather than
  // throwing a confusing error on the first request.
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI in environment. Copy .env.example to .env.');
    process.exit(1);
  }
  if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET in environment. Copy .env.example to .env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;
