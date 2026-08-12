/**
 * Inline feedback banner — the dashboard's single way of telling the user
 * what just happened, so success and failure always look the same wherever
 * they appear.
 *
 * @param {'success'|'error'|'info'} [tone='info']
 * @param {string} [title] - optional bold lead-in
 * @param {React.ReactNode} children - the message
 * @param {string[]} [details] - bullet list, e.g. the backend's `errors` array
 * @param {Function} [onDismiss] - renders a close button when provided
 */
export default function Alert({ tone = 'info', title, children, details, onDismiss }) {
  const icons = { success: '✓', error: '!', info: 'i' };

  return (
    <div
      className={`alert alert--${tone}`}
      // Errors interrupt; successes are announced politely.
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span className="alert__icon" aria-hidden="true">
        {icons[tone]}
      </span>

      <div className="alert__body">
        {title && <p className="alert__title">{title}</p>}
        {children && <p className="alert__message">{children}</p>}

        {/* Field-level problems returned by the API */}
        {details?.length > 0 && (
          <ul className="alert__details">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}
      </div>

      {onDismiss && (
        <button type="button" className="alert__close" onClick={onDismiss} aria-label="Dismiss">
          &#10005;
        </button>
      )}
    </div>
  );
}
