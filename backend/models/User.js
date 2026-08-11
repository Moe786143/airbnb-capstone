const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User schema.
 * A user is either a regular guest ('user') who books stays, or a
 * 'host' who owns accommodations and receives reservations for them.
 * Passwords are never stored in plain text — see the pre-save hook below.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // Excluded from query results by default so the hash can never leak
      // through a controller that forgets to strip it. Use
      // .select('+password') when the hash is genuinely needed (login).
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'host'],
        message: "Role must be either 'user' or 'host'",
      },
      default: 'user',
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: hash the password with bcrypt before it hits the database.
 * Runs only when the password field was actually modified, so re-saving a
 * user (e.g. changing their role) will not double-hash an existing hash.
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Compare a plain-text password candidate against this user's stored hash.
 * @param {string} candidatePassword - the plain-text password to check
 * @returns {Promise<boolean>} true when the password matches
 */
userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Safety net: strip the password from any document that gets serialised to
 * JSON, so it can never be returned in an API response by accident.
 */
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
