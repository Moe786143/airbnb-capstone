/**
 * Error state shown when a fetch fails.
 *
 * Always offers a way forward: a retry button when the caller passes an
 * `onRetry` handler (the common case — a dropped connection usually
 * succeeds on a second try).
 *
 * @param {string} message - what went wrong, from the API or network layer
 * @param {Function} [onRetry] - re-runs the failed request
 * @param {string} [title='Something went wrong']
 */
export default function ErrorMessage({ message, onRetry, title = 'Something went wrong' }) {
  return (
    <div className="error-box" role="alert">
      <div className="error-box__icon" aria-hidden="true">
        !
      </div>
      <div>
        <h3 className="error-box__title">{title}</h3>
        <p className="error-box__message">{message}</p>
        {onRetry && (
          <button type="button" className="btn btn--outline btn--sm" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
