/**
 * Labelled wrapper around a form control.
 *
 * Owns the label, the optional hint, and the error message, and wires up
 * the accessibility attributes that tie them to the input — so every field
 * in the dashboard reports problems the same way.
 *
 * The control itself is passed as a render prop, because it needs the
 * generated ids: `{(props) => <input {...props} />}`.
 *
 * @param {string} id - unique field id
 * @param {string} label
 * @param {string} [hint] - guidance shown under the label
 * @param {string} [error] - validation message; styles the field as invalid
 * @param {boolean} [required]
 * @param {Function} children - render prop receiving the input props
 */
export default function Field({ id, label, hint, error, required = false, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        // Point the input at whichever of its descriptions exist.
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
      })}

      {error && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
