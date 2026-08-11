const express = require('express');
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public: create an account and receive a token.
router.post('/register', registerUser);

// Public: exchange credentials for a token.
router.post('/login', loginUser);

// Protected: who am I? Used to restore session state on the client.
router.get('/me', protect, getCurrentUser);

module.exports = router;
