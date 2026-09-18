import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../ui/Field';
import Alert from '../ui/Alert';
import { TYPES, emptyListing, isValid, toPayload, validateListing } from '../../utils/listing';
import { LOCATIONS } from '../../data/locations';
import './ListingForm.css';

/**
 * The create/edit listing form — two columns: listing name, location,
 * description, guest-experience checkboxes and amenities on the left;
 * price, type, capacity and photos on the right, with Create/Cancel below
 * them. Matches the dashboard's actual Create Listing screen, not just a
 * subset of it — price is the one field a host can leave blank (some
 * listings intentionally show none, see Woodmead City Hotel).
 *
 * One component serves both pages: the create page passes no initial
 * values and the edit page passes the fetched listing, so the two screens
 * can never drift apart in fields or validation rules.
 *
 * @param {object} [initialValues] - form values, from `fromAccommodation()`
 * @param {Function} onSubmit - async (payload) => void; throws to report failure
 * @param {string} heading - "Create Listing" / "Edit Listing"
 * @param {string} [submitLabel='Create']
 * @param {string} [busyLabel] - shown on the submit button while saving
 * @param {object} [serverError] - { message, details } from a failed request
 */
export default function ListingForm({
  initialValues,
  onSubmit,
  heading,
  submitLabel = 'Create',
  busyLabel = 'Saving…',
  serverError,
}) {
  const [values, setValues] = useState(() => initialValues || emptyListing());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [amenityDraft, setAmenityDraft] = useState('');
  const fileInputRef = useRef(null);

  /** Update one field, re-validating once the form has been submitted. */
  const setValue = (field, value) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validateListing(next));
  };

  /** Add the drafted amenity to the list (case-insensitive de-duped), clear the input. */
  const addAmenity = () => {
    const value = amenityDraft.trim();
    if (!value) return;
    const exists = values.amenities.some((a) => a.toLowerCase() === value.toLowerCase());
    if (!exists) setValue('amenities', [...values.amenities, value]);
    setAmenityDraft('');
  };

  const removeAmenity = (index) => {
    setValue('amenities', values.amenities.filter((_, i) => i !== index));
  };

  /** Enter in the amenity box adds it, same as clicking Add. */
  const handleAmenityKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addAmenity();
    }
  };

  /**
   * Read the chosen file(s) as data URLs and add them to `images`.
   * There's no file-upload endpoint on the backend — accommodations just
   * store an array of image URL strings — so a data URL is a real image
   * the rest of the app can render with no server changes.
   */
  const handleFilesChosen = (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setValue('images', [...values.images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Let the same file be chosen again later (e.g. after removing it).
    event.target.value = '';
  };

  const removeImage = (index) => {
    setValue('images', values.images.filter((_, i) => i !== index));
  };

  /** Validate, then hand the payload to the page. */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validateListing(values);
    setErrors(found);
    setSubmitted(true);

    if (!isValid(found)) {
      document.querySelector('.field--invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(toPayload(values));
    } finally {
      setSubmitting(false);
    }
  };

  const errorFor = (field) => (submitted ? errors[field] : undefined);

  // Editing a listing whose location predates this dropdown (e.g. the
  // seeded "Sandton, Johannesburg") would otherwise vanish from the select
  // with no matching option — keep it selectable so saving doesn't
  // silently blank it out.
  const locationOptions =
    values.location && !LOCATIONS.some((loc) => `${loc.name}, ${loc.region}` === values.location)
      ? [...LOCATIONS, { name: values.location, region: '' }]
      : LOCATIONS;

  return (
    <form className="listing-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <Alert tone="error" title="We couldn't save this listing" details={serverError.details}>
          {serverError.message}
        </Alert>
      )}

      <h1 className="listing-form__heading">{heading}</h1>

      <div className="listing-form__grid">
        {/* --- Left column: identity, description, extras --------------- */}
        <div className="listing-form__col">
          <Field id="title" label="Listing Title" required error={errorFor('title')}>
            {(props) => (
              <input
                {...props}
                type="text"
                className="input"
                value={values.title}
                onChange={(event) => setValue('title', event.target.value)}
              />
            )}
          </Field>

          <Field id="location" label="Location" required error={errorFor('location')}>
            {(props) => (
              <select
                {...props}
                className="input"
                value={values.location}
                onChange={(event) => setValue('location', event.target.value)}
              >
                <option value="" disabled>
                  Select a location
                </option>
                {locationOptions.map((loc) => {
                  const display = loc.region ? `${loc.name}, ${loc.region}` : loc.name;
                  return (
                    <option key={display} value={display}>
                      {display}
                    </option>
                  );
                })}
              </select>
            )}
          </Field>

          <Field id="description" label="Description" error={errorFor('description')}>
            {(props) => (
              <textarea
                {...props}
                className="input input--textarea listing-form__textarea"
                value={values.description}
                onChange={(event) => setValue('description', event.target.value)}
              />
            )}
          </Field>

          <div className="listing-form__checkboxes">
            <label className="listing-form__checkbox">
              <input
                type="checkbox"
                checked={values.enhancedCleaning}
                onChange={(event) => setValue('enhancedCleaning', event.target.checked)}
              />
              Enhanced Cleaning
            </label>

            <label className="listing-form__checkbox">
              <input
                type="checkbox"
                checked={values.selfCheckIn}
                onChange={(event) => setValue('selfCheckIn', event.target.checked)}
              />
              Self Check-In
            </label>
          </div>

          <div className="listing-form__amenities">
            <div className="listing-form__amenities-row">
              <Field id="amenity" label="Amenities">
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    className="input listing-form__input--amenity"
                    value={amenityDraft}
                    onChange={(event) => setAmenityDraft(event.target.value)}
                    onKeyDown={handleAmenityKeyDown}
                  />
                )}
              </Field>

              <button
                type="button"
                className="listing-form__btn listing-form__btn--add"
                onClick={addAmenity}
              >
                Add
              </button>
            </div>

            {values.amenities.length > 0 && (
              <ul className="listing-form__chips">
                {values.amenities.map((amenity, index) => (
                  <li className="listing-form__chip" key={`${amenity}-${index}`}>
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      aria-label={`Remove ${amenity}`}
                    >
                      &#10005;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- Right column: price, type, capacity, photos --------------- */}
        <div className="listing-form__col">
          <div className="listing-form__row-inline">
            <Field id="price" label="Price" error={errorFor('price')}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                  value={values.price}
                  onChange={(event) => setValue('price', event.target.value)}
                />
              )}
            </Field>

            <Field id="type" label="Type" error={errorFor('type')}>
              {(props) => (
                <select
                  {...props}
                  className="input"
                  value={values.type}
                  onChange={(event) => setValue('type', event.target.value)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>

          <div className="listing-form__row-inline listing-form__row-inline--three">
            <Field id="guests" label="Guests" error={errorFor('guests')}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min="1"
                  step="1"
                  className="input"
                  value={values.guests}
                  onChange={(event) => setValue('guests', event.target.value)}
                />
              )}
            </Field>

            <Field id="bedrooms" label="Bedrooms" error={errorFor('bedrooms')}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                  value={values.bedrooms}
                  onChange={(event) => setValue('bedrooms', event.target.value)}
                />
              )}
            </Field>

            <Field id="bathrooms" label="Bathrooms" error={errorFor('bathrooms')}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                  value={values.bathrooms}
                  onChange={(event) => setValue('bathrooms', event.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="listing-form__images">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFilesChosen}
            />
            <button
              type="button"
              className="listing-form__btn listing-form__btn--upload"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Images
            </button>

            <div className="listing-form__images-box">
              {values.images.length === 0 ? (
                <p className="listing-form__images-empty">No images uploaded</p>
              ) : (
                <ul className="listing-form__thumbs">
                  {values.images.map((src, index) => (
                    <li className="listing-form__thumb" key={index}>
                      <img src={src} alt={`Listing photo ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        &#10005;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="listing-form__actions">
            <button type="submit" className="listing-form__btn listing-form__btn--create" disabled={submitting}>
              {submitting ? busyLabel : submitLabel}
            </button>
            <Link to="/" className="listing-form__btn listing-form__btn--cancel">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
