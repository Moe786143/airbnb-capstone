/**
 * Loading indicator shown while a fetch is in flight.
 *
 * @param {string} [label='Loading…'] - text under the spinner, also read out
 *   to screen readers via the status role
 * @param {boolean} [inline=false] - compact version for use inside a card
 */
export default function Spinner({ label = 'Loading…', inline = false }) {
  return (
    <div className={inline ? 'spinner-wrap spinner-wrap--inline' : 'spinner-wrap'} role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-label">{label}</p>
    </div>
  );
}
