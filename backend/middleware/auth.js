const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Route guard: verifies the JWT sent in the Authorization header and
 * attaches the matching user document to `req.user`.
 *
 * Expected header format: `Authorization: Bearer <token>`
 *
 * Responds 401 when the header is missing/malformed, the token is invalid
 * or expired, or the user the token refers to no longer exists.
 * Downstream handlers can assume `req.user` is a real, current user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Not authorized: missing or malformed Authorization header',
      });
    }

    // "Bearer <token>" -> "<token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized: no token provided' });
    }

    // Throws if the signature is bad or the token has expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look the user up fresh so a deleted user's token stops working
    // immediately instead of staying valid until it expires.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Not authorized: user no longer exists' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Not authorized: token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized: invalid token' });
    }
    return res
      .status(500)
      .json({ message: 'Server error while verifying token', error: error.message });
  }
};

/**
 * Role guard, used after `protect`. Rejects with 403 when the logged-in
 * user's role is not in the allowed list.
 *
 * Usage: router.post('/', protect, restrictTo('host'), createAccommodation)
 *
 * @param {...string} roles - roles permitted to reach the handler
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Forbidden: this action requires one of the following roles: ${roles.join(', ')}`,
    });
  }
  return next();
};

module.exports = { protect, restrictTo };
