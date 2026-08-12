/**
 * Listing form helpers: the blank form shape, conversion to and from the
 * API's document shape, and the validation rules.
 *
 * Kept out of the component so the create and edit pages share one set of
 * rules, and so the rules can be reasoned about on their own.
 */

/** The property types offered in the form's dropdown. */
export const TYPES = [
  'Entire home',
  'Entire apartment',
  'Entire loft',
  'Entire cabin',
  'Entire cottage',
  'Entire villa',
  'Entire chalet',
  'Entire townhouse',
  'Private room',
  'Shared room',
];

/**
 * A blank form. Numeric fields are strings because that is what an
 * `<input>` gives back; they are cast on submit.
 */
export const emptyListing = () => ({
  title: '',
  type: TYPES[0],
  location: '',
  description: '',
  price: '',
  guests: '1',
  bedrooms: '1',
  bathrooms: '1',
  weeklyDiscount: '0',
  cleaningFee: '0',
  serviceFee: '0',
  occupancyTaxes: '0',
  enhancedCleaning: false,
  selfCheckIn: false,
  // Start with one empty row each so the form shows an input to type into.
  images: [''],
  amenities: [''],
});

/**
 * Convert an accommodation document from the API into form values.
 * Used to pre-fill the edit form.
 *
 * @param {object} doc - an accommodation from GET /api/accommodations/:id
 */
export const fromAccommodation = (doc) => ({
  title: doc.title ?? '',
  type: doc.type ?? TYPES[0],
  location: doc.location ?? '',
  description: doc.description ?? '',
  price: String(doc.price ?? ''),
  guests: String(doc.guests ?? '1'),
  bedrooms: String(doc.bedrooms ?? '0'),
  bathrooms: String(doc.bathrooms ?? '0'),
  weeklyDiscount: String(doc.weeklyDiscount ?? '0'),
  cleaningFee: String(doc.cleaningFee ?? '0'),
  serviceFee: String(doc.serviceFee ?? '0'),
  occupancyTaxes: String(doc.occupancyTaxes ?? '0'),
  enhancedCleaning: Boolean(doc.enhancedCleaning),
  selfCheckIn: Boolean(doc.selfCheckIn),
  // Keep one empty row when the listing has none, so there is something to
  // type into rather than an empty area with only an "Add" button.
  images: doc.images?.length ? [...doc.images] : [''],
  amenities: doc.amenities?.length ? [...doc.amenities] : [''],
});

/**
 * Convert form values into the JSON body the API expects: numbers cast from
 * strings, text trimmed, and blank rows dropped from the arrays.
 *
 * @param {object} values - current form state
 * @returns {object} the request body for POST/PUT /api/accommodations
 */
export const toPayload = (values) => ({
  title: values.title.trim(),
  type: values.type.trim(),
  location: values.location.trim(),
  description: values.description.trim(),
  price: Number(values.price),
  guests: Number(values.guests),
  bedrooms: Number(values.bedrooms),
  bathrooms: Number(values.bathrooms),
  weeklyDiscount: Number(values.weeklyDiscount || 0),
  cleaningFee: Number(values.cleaningFee || 0),
  serviceFee: Number(values.serviceFee || 0),
  occupancyTaxes: Number(values.occupancyTaxes || 0),
  enhancedCleaning: Boolean(values.enhancedCleaning),
  selfCheckIn: Boolean(values.selfCheckIn),
  images: values.images.map((image) => image.trim()).filter(Boolean),
  amenities: values.amenities.map((amenity) => amenity.trim()).filter(Boolean),
});

/**
 * Check a numeric field.
 *
 * @param {string} raw - the raw input value
 * @param {object} rules
 * @param {string} rules.label - field name used in the message
 * @param {boolean} [rules.required]
 * @param {number} [rules.min]
 * @param {number} [rules.max]
 * @param {boolean} [rules.integer]
 * @returns {string|null} an error message, or null when valid
 */
const validateNumber = (raw, { label, required = false, min, max, integer = false }) => {
  const value = String(raw ?? '').trim();

  if (value === '') {
    return required ? `${label} is required` : null;
  }
  if (Number.isNaN(Number(value))) {
    return `${label} must be a number`;
  }

  const parsed = Number(value);

  if (integer && !Number.isInteger(parsed)) {
    return `${label} must be a whole number`;
  }
  if (min !== undefined && parsed < min) {
    return `${label} must be at least ${min}`;
  }
  if (max !== undefined && parsed > max) {
    return `${label} cannot be more than ${max}`;
  }
  return null;
};

/** True when a string looks like an http(s) URL. */
const looksLikeUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate the whole form.
 *
 * Returns a map of field name to message. Repeatable fields also get an
 * index-aligned array (`imageItems`, `amenityItems`) so each row can show
 * its own error underneath it.
 *
 * @param {object} values - current form state
 * @returns {object} errors — empty when the form is valid
 */
export const validateListing = (values) => {
  const errors = {};

  /* --- Text fields ------------------------------------------------------ */
  const title = values.title.trim();
  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (title.length > 100) {
    errors.title = 'Title cannot be longer than 100 characters';
  }

  if (!values.type.trim()) {
    errors.type = 'Choose a property type';
  }

  const location = values.location.trim();
  if (!location) {
    errors.location = 'Location is required';
  } else if (location.length < 3) {
    errors.location = 'Location must be at least 3 characters';
  }

  if (values.description.trim().length > 2000) {
    errors.description = 'Description cannot be longer than 2000 characters';
  }

  /* --- Numbers ---------------------------------------------------------- */
  const numberChecks = {
    price: { label: 'Price per night', required: true, min: 1, max: 100000 },
    guests: { label: 'Guests', required: true, min: 1, max: 50, integer: true },
    bedrooms: { label: 'Bedrooms', required: true, min: 0, max: 50, integer: true },
    bathrooms: { label: 'Bathrooms', required: true, min: 0, max: 50 },
    weeklyDiscount: { label: 'Weekly discount', min: 0, max: 100 },
    cleaningFee: { label: 'Cleaning fee', min: 0, max: 100000 },
    serviceFee: { label: 'Service fee', min: 0, max: 100000 },
    occupancyTaxes: { label: 'Occupancy taxes', min: 0, max: 100000 },
  };

  Object.entries(numberChecks).forEach(([field, rules]) => {
    const message = validateNumber(values[field], rules);
    if (message) errors[field] = message;
  });

  /* --- Images ----------------------------------------------------------- */
  const imageItems = [];
  const filledImages = values.images.filter((image) => image.trim());

  values.images.forEach((image, index) => {
    const value = image.trim();
    // A single blank row is fine — it is just an empty input waiting to be
    // filled. Only flag blanks when other rows have content.
    if (!value) {
      imageItems[index] = filledImages.length > 0 ? 'Remove this empty row or add a URL' : null;
      return;
    }
    imageItems[index] = looksLikeUrl(value)
      ? null
      : 'Enter a full URL starting with http:// or https://';
  });

  if (filledImages.length === 0) {
    errors.images = 'Add at least one image URL';
  }
  if (imageItems.some(Boolean)) {
    errors.imageItems = imageItems;
  }

  /* --- Amenities -------------------------------------------------------- */
  const amenityItems = [];
  const filledAmenities = values.amenities.map((a) => a.trim()).filter(Boolean);
  const seen = new Set();

  values.amenities.forEach((amenity, index) => {
    const value = amenity.trim();
    if (!value) {
      amenityItems[index] =
        filledAmenities.length > 0 ? 'Remove this empty row or name an amenity' : null;
      return;
    }
    const key = value.toLowerCase();
    amenityItems[index] = seen.has(key) ? 'This amenity is already listed' : null;
    seen.add(key);
  });

  if (amenityItems.some(Boolean)) {
    errors.amenityItems = amenityItems;
  }

  return errors;
};

/**
 * True when a validation result contains no problems.
 * `imageItems`/`amenityItems` are sparse arrays, so a plain key count is
 * enough — they are only ever set when they hold at least one message.
 */
export const isValid = (errors) => Object.keys(errors).length === 0;
