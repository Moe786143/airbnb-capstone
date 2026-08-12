import Alert from './Alert';

/**
 * Full-width error state for a failed page load, with a retry button.
 *
 * Distinct from <Alert> in that it is the whole content of a page rather
 * than a banner above working content — a dropped request usually succeeds
 * on a second attempt, so it always offers a way forward.
 *
 * @param {string} message - what went wrong
 * @param {Function} [onRetry]
 * @param {string} [title='We couldn't load this']
 */
export default function ErrorState({ message, onRetry, title = "We couldn't load this" }) {
  return (
    <div className="error-state">
      <Alert tone="error" title={title}>
        {message}
      </Alert>

      {onRetry && (
        <button type="button" className="btn btn--outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
