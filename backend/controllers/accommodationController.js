const mongoose = require('mongoose');
const Accommodation = require('../models/Accommodation');

/**
 * Validate the body of a create/update request for an accommodation.
 * On create every required field must be present; on update we only check
 * the fields that were actually supplied (partial updates are allowed).
 *
 * @param {object} body - the request body
 * @param {boolean} isUpdate - true when validating a PUT
 * @returns {string[]} a list of human-readable problems (empty when valid)
 */
const validateAccommodationBody = (body, isUpdate = false) => {
  const errors = [];
  // Matches what the admin's Create Listing form actually collects (see
  // admin/src/utils/listing.js) — price stays optional; some listings
  // intentionally show none (see Woodmead City Hotel).
  const required = ['title', 'type', 'location', 'guests', 'bedrooms', 'bathrooms'];

  if (!isUpdate) {
    required.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} is required`);
      }
    });
  }

  // Numeric fields must be numbers and non-negative when present.
  const numericFields = [
    'price', 'guests', 'bedrooms', 'bathrooms', 'rating', 'reviews',
    'weeklyDiscount', 'cleaningFee', 'serviceFee', 'occupancyTaxes',
  ];
  numericFields.forEach((field) => {
    if (body[field] !== undefined) {
      const value = Number(body[field]);
      if (Number.isNaN(value)) {
        errors.push(`${field} must be a number`);
      } else if (value < 0) {
        errors.push(`${field} cannot be negative`);
      }
    }
  });

  if (body.guests !== undefined && Number(body.guests) < 1) {
    errors.push('guests must be at least 1');
  }
  if (body.rating !== undefined && Number(body.rating) > 5) {
    errors.push('rating cannot be greater than 5');
  }

  // Array fields must genuinely be arrays.
  ['images', 'amenities'].forEach((field) => {
    if (body[field] !== undefined && !Array.isArray(body[field])) {
      errors.push(`${field} must be an array`);
    }
  });

  return errors;
};

/**
 * POST /api/accommodations
 * Protected. Creates a listing owned by the logged-in user, who becomes
 * its host. `host_id` is taken from the token — never from the body — so a
 * client cannot create a listing on someone else's behalf.
 *
 * Responses: 201 created | 400 validation error | 401 | 500
 */
const createAccommodation = async (req, res) => {
  try {
    const errors = validateAccommodationBody(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const accommodation = await Accommodation.create({
      ...req.body,
      host: req.user.username,
      host_id: req.user._id,
    });

    return res.status(201).json(accommodation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Server error while creating accommodation',
      error: error.message,
    });
  }
};

/**
 * GET /api/accommodations
 * Public. Returns all listings, optionally filtered.
 *
 * Supported query params:
 *   location  - case-insensitive partial match (e.g. ?location=paris)
 *   type      - exact, case-insensitive match
 *   guests    - minimum capacity
 *   minPrice  - lower price bound (inclusive)
 *   maxPrice  - upper price bound (inclusive)
 *   sort      - 'price' | '-price' | 'rating' | '-rating'
 *   page      - 1-based page number (default 1)
 *   limit     - results per page (default 20, max 100)
 *
 * Responses: 200 ok | 400 bad query value | 500
 */
const getAccommodations = async (req, res) => {
  try {
    const { location, type, guests, minPrice, maxPrice, sort, page, limit } = req.query;
    const filter = {};

    // Partial, case-insensitive location search. The user's input is escaped
    // so regex metacharacters in a search box cannot alter the query.
    if (location) {
      const escaped = String(location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.location = { $regex: escaped, $options: 'i' };
    }

    if (type) {
      const escaped = String(type).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.type = { $regex: `^${escaped}$`, $options: 'i' };
    }

    if (guests !== undefined) {
      const minGuests = Number(guests);
      if (Number.isNaN(minGuests) || minGuests < 1) {
        return res
          .status(400)
          .json({ message: 'guests must be a positive number' });
      }
      filter.guests = { $gte: minGuests };
    }

    // Price range — both bounds are optional and can be combined.
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        const min = Number(minPrice);
        if (Number.isNaN(min)) {
          return res.status(400).json({ message: 'minPrice must be a number' });
        }
        filter.price.$gte = min;
      }
      if (maxPrice !== undefined) {
        const max = Number(maxPrice);
        if (Number.isNaN(max)) {
          return res.status(400).json({ message: 'maxPrice must be a number' });
        }
        filter.price.$lte = max;
      }
    }

    // Whitelist sort keys so the query string cannot sort by arbitrary fields.
    const allowedSorts = ['price', '-price', 'rating', '-rating', 'createdAt', '-createdAt'];
    const sortBy = allowedSorts.includes(sort) ? sort : '-createdAt';

    // Clamp pagination so a client cannot ask for the whole collection.
    const pageNum = Math.max(1, Number(page) || 1);
    const perPage = Math.min(100, Math.max(1, Number(limit) || 20));

    const [accommodations, total] = await Promise.all([
      Accommodation.find(filter)
        .sort(sortBy)
        .skip((pageNum - 1) * perPage)
        .limit(perPage),
      Accommodation.countDocuments(filter),
    ]);

    return res.status(200).json({
      count: accommodations.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / perPage) || 1,
      accommodations,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching accommodations',
      error: error.message,
    });
  }
};

/**
 * GET /api/accommodations/:id
 * Public. Returns a single listing by its id.
 *
 * Responses: 200 ok | 400 malformed id | 404 not found | 500
 */
const getAccommodationById = async (req, res) => {
  try {
    // Guard first: passing a non-ObjectId string to findById throws a
    // CastError, which is really a 400 rather than a 500.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid accommodation id' });
    }

    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    return res.status(200).json(accommodation);
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching accommodation',
      error: error.message,
    });
  }
};

/**
 * PUT /api/accommodations/:id
 * Protected, owner only. Applies a partial update to a listing.
 * Ownership fields (host, host_id) are stripped from the body so a host
 * cannot transfer a listing to another account through this route.
 *
 * Responses: 200 ok | 400 | 401 | 403 not the owner | 404 | 500
 */
const updateAccommodation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid accommodation id' });
    }

    const errors = validateAccommodationBody(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Only the host who owns this listing may change it.
    if (accommodation.host_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can only edit your own listings' });
    }

    // Never let the client reassign ownership or the document id.
    const { host, host_id, _id, ...updates } = req.body;

    const updated = await Accommodation.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Server error while updating accommodation',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/accommodations/:id
 * Protected, owner only. Removes a listing.
 *
 * Responses: 200 deleted | 400 | 401 | 403 not the owner | 404 | 500
 */
const deleteAccommodation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid accommodation id' });
    }

    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (accommodation.host_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can only delete your own listings' });
    }

    await accommodation.deleteOne();

    return res.status(200).json({
      message: 'Accommodation deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while deleting accommodation',
      error: error.message,
    });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
