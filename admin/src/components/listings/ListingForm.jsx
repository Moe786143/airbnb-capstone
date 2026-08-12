import { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../ui/Field';
import Alert from '../ui/Alert';
import RepeatableInput from './RepeatableInput';
import { TYPES, emptyListing, isValid, toPayload, validateListing } from '../../utils/listing';

/**
 * The create/edit listing form.
 *
 * One component serves both pages: the create page passes no initial values
 * and the edit page passes the fetched listing, so the two screens can never
 * drift apart in fields or validation rules.
 *
 * Validation runs on submit and then live on every keystroke, so the form
 * does not nag while it is being filled in but does clear errors as soon as
 * they are fixed. Submission is delegated to the page via `onSubmit`.
 *
 * @param {object} [initialValues] - form values, from `fromAccommodation()`
 * @param {Function} onSubmit - async (payload) => void; throws to report failure
 * @param {string} submitLabel - e.g. "Publish listing" / "Save changes"
 * @param {string} [busyLabel] - shown while submitting
 * @param {object} [serverError] - { message, details } from a failed request
 */
export default function ListingForm({
  initialValues,
  onSubmit,
  submitLabel,
  busyLabel = 'Saving…',
  serverError,
}) {
  const [values, setValues] = useState(() => initialValues || emptyListing());
  const [errors, setErrors] = useState({});
  // Errors stay hidden until the first submit attempt, so an untouched form
  // is not covered in red before the host has typed anything.
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** Update one field, re-validating once the form has been submitted. */
  const setValue = (field, value) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validateListing(next));
  };

  /** Validate, then hand the payload to the page. */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validateListing(values);
    setErrors(found);
    setSubmitted(true);

    if (!isValid(found)) {
      // Move the host to the first problem rather than leaving them to hunt.
      document.querySelector('.field--invalid, .repeatable--invalid, .input--invalid')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(toPayload(values));
    } finally {
      setSubmitting(false);
    }
  };

  // Only surface messages after a submit attempt.
  const errorFor = (field) => (submitted ? errors[field] : undefined);
  const itemErrorsFor = (field) => (submitted ? errors[field] || [] : []);
  const problemCount = Object.keys(errors).length;

  return (
    <form className="listing-form" onSubmit={handleSubmit} noValidate>
      {/* Whatever the server said about the last attempt */}
      {serverError && (
        <Alert tone="error" title="We couldn't save this listing" details={serverError.details}>
          {serverError.message}
        </Alert>
      )}

      {/* Summary of local validation problems */}
      {submitted && problemCount > 0 && (
        <Alert tone="error" title="Check the highlighted fields">
          {problemCount === 1
            ? 'One field needs your attention before this can be saved.'
            : `${problemCount} fields need your attention before this can be saved.`}
        </Alert>
      )}

      {/* --- The basics --------------------------------------------------- */}
      <section className="form-section">
        <h2 className="form-section__title">The basics</h2>

        <Field id="title" label="Title" required error={errorFor('title')}
          hint="What guests see first — keep it short and specific.">
          {(props) => (
            <input
              {...props}
              type="text"
              className="input"
              value={values.title}
              maxLength={120}
              placeholder="Sunlit Loft in the Marais"
              onChange={(event) => setValue('title', event.target.value)}
            />
          )}
        </Field>

        <div className="form-grid form-grid--2">
          <Field id="type" label="Property type" required error={errorFor('type')}>
            {(props) => (
              <select
                {...props}
                className="input"
                value={values.type}
                onChange={(event) => setValue('type', event.target.value)}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field id="location" label="Location" required error={errorFor('location')}
            hint="City and country, e.g. Paris, France">
            {(props) => (
              <input
                {...props}
                type="text"
                className="input"
                value={values.location}
                placeholder="Paris, France"
                onChange={(event) => setValue('location', event.target.value)}
              />
            )}
          </Field>
        </div>

        <Field id="description" label="Description" error={errorFor('description')}
          hint="Tell guests what makes this place worth staying in.">
          {(props) => (
            <textarea
              {...props}
              className="input input--textarea"
              value={values.description}
              rows={5}
              maxLength={2000}
              placeholder="A bright top-floor loft with exposed beams, five minutes from…"
              onChange={(event) => setValue('description', event.target.value)}
            />
          )}
        </Field>
      </section>

      {/* --- Capacity ----------------------------------------------------- */}
      <section className="form-section">
        <h2 className="form-section__title">Space and capacity</h2>

        <div className="form-grid form-grid--3">
          <Field id="guests" label="Guests" required error={errorFor('guests')}>
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="1"
                step="1"
                value={values.guests}
                onChange={(event) => setValue('guests', event.target.value)}
              />
            )}
          </Field>

          <Field id="bedrooms" label="Bedrooms" required error={errorFor('bedrooms')}>
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="0"
                step="1"
                value={values.bedrooms}
                onChange={(event) => setValue('bedrooms', event.target.value)}
              />
            )}
          </Field>

          <Field id="bathrooms" label="Bathrooms" required error={errorFor('bathrooms')}
            hint="Halves allowed, e.g. 1.5">
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="0"
                step="0.5"
                value={values.bathrooms}
                onChange={(event) => setValue('bathrooms', event.target.value)}
              />
            )}
          </Field>
        </div>
      </section>

      {/* --- Pricing ------------------------------------------------------ */}
      <section className="form-section">
        <h2 className="form-section__title">Pricing</h2>

        <div className="form-grid form-grid--2">
          <Field id="price" label="Price per night (USD)" required error={errorFor('price')}>
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="1"
                step="1"
                value={values.price}
                placeholder="165"
                onChange={(event) => setValue('price', event.target.value)}
              />
            )}
          </Field>

          <Field id="weeklyDiscount" label="Weekly discount (%)"
            error={errorFor('weeklyDiscount')}
            hint="Applied automatically to stays of 7 nights or more.">
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="0"
                max="100"
                step="1"
                value={values.weeklyDiscount}
                onChange={(event) => setValue('weeklyDiscount', event.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="form-grid form-grid--3">
          <Field id="cleaningFee" label="Cleaning fee (USD)" error={errorFor('cleaningFee')}>
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="0"
                step="1"
                value={values.cleaningFee}
                onChange={(event) => setValue('cleaningFee', event.target.value)}
              />
            )}
          </Field>

          <Field id="serviceFee" label="Service fee (USD)" error={errorFor('serviceFee')}>
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="0"
                step="1"
                value={values.serviceFee}
                onChange={(event) => setValue('serviceFee', event.target.value)}
              />
            )}
          </Field>

          <Field id="occupancyTaxes" label="Occupancy taxes (USD)"
            error={errorFor('occupancyTaxes')}>
            {(props) => (
              <input
                {...props}
                type="number"
                className="input"
                min="0"
                step="1"
                value={values.occupancyTaxes}
                onChange={(event) => setValue('occupancyTaxes', event.target.value)}
              />
            )}
          </Field>
        </div>
      </section>

      {/* --- Photos and amenities ----------------------------------------- */}
      <section className="form-section">
        <h2 className="form-section__title">Photos and amenities</h2>

        <RepeatableInput
          idPrefix="image"
          legend="Image URLs"
          hint="The first image is used as the listing's main photo."
          values={values.images}
          onChange={(images) => setValue('images', images)}
          error={errorFor('images')}
          itemErrors={itemErrorsFor('imageItems')}
          placeholder="https://images.unsplash.com/photo-…"
          addLabel="Add another image"
        />

        <RepeatableInput
          idPrefix="amenity"
          legend="Amenities"
          hint="One per row, e.g. Wifi, Kitchen, Free parking."
          values={values.amenities}
          onChange={(amenities) => setValue('amenities', amenities)}
          itemErrors={itemErrorsFor('amenityItems')}
          placeholder="Wifi"
          addLabel="Add another amenity"
        />
      </section>

      {/* --- Guest experience --------------------------------------------- */}
      <section className="form-section">
        <h2 className="form-section__title">Guest experience</h2>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={values.selfCheckIn}
            onChange={(event) => setValue('selfCheckIn', event.target.checked)}
          />
          <span>
            <strong>Self check-in</strong>
            <span className="checkbox__hint">Guests can let themselves in with a keypad.</span>
          </span>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={values.enhancedCleaning}
            onChange={(event) => setValue('enhancedCleaning', event.target.checked)}
          />
          <span>
            <strong>Enhanced cleaning</strong>
            <span className="checkbox__hint">
              You follow Airbnb&apos;s 5-step enhanced cleaning process.
            </span>
          </span>
        </label>
      </section>

      <div className="form-actions">
        <Link to="/" className="btn btn--ghost">
          Cancel
        </Link>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
