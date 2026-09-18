/**
 * Listing form helpers: the blank form shape, conversion to and from the
 * API's document shape, and the validation rules.
 *
 * Kept out of the component so the create and edit pages share one set of
 * rules, and so the rules can be reasoned about on their own.
 *
 * The field set here — title, location, description, enhanced
 * cleaning/self check-in, amenities, price, type, guests, bedrooms,
 * bathrooms, images — matches the dashboard's actual Create Listing
 * screen. `toPayload` omits price when it's left blank, and because the
 * API's PUT only sets the keys it's given, editing a listing through this
 * form never clears fields it doesn't collect (rating, reviews…).
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

/** A blank form. Numeric fields are strings — that's what an <input> gives back. */
export const emptyListing = () => ({
  title: '',
  type: '',
  location: '',
  description: '',
  price: '',
  guests: '1',
  bedrooms: '0',
  bathrooms: '0',
  enhancedCleaning: false,
  selfCheckIn: false,
  images: [],
  amenities: [],
});

/**
 * Convert an accommodation document from the API into form values.
 * Used to pre-fill the edit form. Only the fields this form collects are
 * carried over — everything else on the document is left as-is until it's
 * saved again (see the module comment above).
 *
 * @param {object} doc - an accommodation from GET /api/accommodations/:id
 */
export const fromAccommodation = (doc) => ({
  title: doc.title ?? '',
  type: doc.type ?? '',
  location: doc.location ?? '',
  description: doc.description ?? '',
  price: doc.price != null ? String(doc.price) : '',
  guests: String(doc.guests ?? '1'),
  bedrooms: String(doc.bedrooms ?? '0'),
  bathrooms: String(doc.bathrooms ?? '0'),
  enhancedCleaning: Boolean(doc.enhancedCleaning),
  selfCheckIn: Boolean(doc.selfCheckIn),
  images: doc.images?.length ? [...doc.images] : [],
  amenities: doc.amenities?.length ? [...doc.amenities] : [],
});

/**
 * Convert form values into the JSON body the API expects: numbers cast from
 * strings, text trimmed, blank amenity/image rows dropped, and price left
 * out entirely when the host didn't type one (some listings intentionally
 * show no nightly price — see Woodmead City Hotel).
 *
 * @param {object} values - current form state
 * @returns {object} the request body for POST/PUT /api/accommodations
 */
export const toPayload = (values) => {
  const payload = {
    title: values.title.trim(),
    type: values.type.trim(),
    location: values.location.trim(),
    description: values.description.trim(),
    guests: Number(values.guests),
    bedrooms: Number(values.bedrooms),
    bathrooms: Number(values.bathrooms),
    enhancedCleaning: Boolean(values.enhancedCleaning),
    selfCheckIn: Boolean(values.selfCheckIn),
    images: values.images.map((image) => image.trim()).filter(Boolean),
    amenities: values.amenities.map((amenity) => amenity.trim()).filter(Boolean),
  };

  if (values.price.trim() !== '') {
    payload.price = Number(values.price);
  }

  return payload;
};

/**
 * Check a numeric field.
 *
 * @param {string} raw - the raw input value
 * @param {object} rules
 * @param {string} rules.label - field name used in the message
 * @param {boolean} [rules.required]
 * @param {number} [rules.min]
 * @param {number} [rules.max]
 * @returns {string|null} an error message, or null when valid
 */
const validateNumber = (raw, { label, required = false, min, max }) => {
  const value = String(raw ?? '').trim();

  if (value === '') {
    return required ? `${label} is required` : null;
  }
  if (Number.isNaN(Number(value))) {
    return `${label} must be a number`;
  }

  const parsed = Number(value);
  if (min !== undefined && parsed < min) {
    return `${label} must be at least ${min}`;
  }
  if (max !== undefined && parsed > max) {
    return `${label} cannot be more than ${max}`;
  }
  return null;
};

/**
 * Validate the whole form.
 *
 * @param {object} values - current form state
 * @returns {object} errors — empty when the form is valid
 */
export const validateListing = (values) => {
  const errors = {};

  const title = values.title.trim();
  if (!title) {
    errors.title = 'Listing name is required';
  } else if (title.length > 120) {
    errors.title = 'Listing name cannot be longer than 120 characters';
  }

  if (!values.type.trim()) {
    errors.type = 'Choose a type';
  }

  if (!values.location.trim()) {
    errors.location = 'Choose a location';
  }

  if (values.description.trim().length > 2000) {
    errors.description = 'Description cannot be longer than 2000 characters';
  }

  const numberChecks = {
    guests: { label: 'Guests', required: true, min: 1, max: 50 },
    bedrooms: { label: 'Bedrooms', required: true, min: 0, max: 50 },
    bathrooms: { label: 'Bathrooms', required: true, min: 0, max: 50 },
  };

  Object.entries(numberChecks).forEach(([field, rules]) => {
    const message = validateNumber(values[field], rules);
    if (message) errors[field] = message;
  });

  // Price is optional — see toPayload — but if a host does type one in, it
  // has to be a sane number.
  const priceMessage = validateNumber(values.price, { label: 'Price', min: 0, max: 100000 });
  if (priceMessage) errors.price = priceMessage;

  return errors;
};

/**
 * True when a validation result contains no problems.
 */
export const isValid = (errors) => Object.keys(errors).length === 0;
