/**
 * A list of text inputs the host can add to and remove from — used for both
 * image URLs and amenities.
 *
 * Each row carries its own error message underneath it, so a single bad URL
 * in a list of six is obvious. The last remaining row can be cleared but
 * not removed, so the control never collapses to nothing to type into.
 *
 * @param {string} idPrefix - base for each row's input id
 * @param {string} legend - the group's heading
 * @param {string} [hint]
 * @param {string[]} values
 * @param {Function} onChange - receives the whole updated array
 * @param {string} [error] - list-level message, e.g. "add at least one"
 * @param {string[]} [itemErrors] - index-aligned per-row messages
 * @param {string} [placeholder]
 * @param {string} [addLabel='Add another']
 */
export default function RepeatableInput({
  idPrefix,
  legend,
  hint,
  values,
  onChange,
  error,
  itemErrors = [],
  placeholder,
  addLabel = 'Add another',
}) {
  /** Replace the value at one index. */
  const updateAt = (index, value) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  /** Drop a row, keeping at least one input on screen. */
  const removeAt = (index) => {
    const next = values.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : ['']);
  };

  return (
    <fieldset className={`repeatable${error ? ' repeatable--invalid' : ''}`}>
      <legend className="repeatable__legend">{legend}</legend>
      {hint && <p className="repeatable__hint">{hint}</p>}

      <div className="repeatable__rows">
        {values.map((value, index) => {
          const rowId = `${idPrefix}-${index}`;
          const rowError = itemErrors[index];

          return (
            // Index keys are correct here: rows are positional and their
            // contents are edited in place.
            <div className="repeatable__row" key={rowId}>
              <div className="repeatable__control">
                <input
                  id={rowId}
                  type="text"
                  className={`input${rowError ? ' input--invalid' : ''}`}
                  value={value}
                  placeholder={placeholder}
                  aria-label={`${legend} ${index + 1}`}
                  aria-invalid={rowError ? true : undefined}
                  onChange={(event) => updateAt(index, event.target.value)}
                />
                <button
                  type="button"
                  className="repeatable__remove"
                  onClick={() => removeAt(index)}
                  // Keeps one row on screen at all times.
                  disabled={values.length === 1 && !value}
                  aria-label={`Remove ${legend} ${index + 1}`}
                >
                  &#10005;
                </button>
              </div>

              {rowError && (
                <p className="field__error" role="alert">
                  {rowError}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="btn btn--ghost btn--sm"
        onClick={() => onChange([...values, ''])}
      >
        + {addLabel}
      </button>

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
