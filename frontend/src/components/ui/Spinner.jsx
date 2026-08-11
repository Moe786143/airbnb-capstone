/**
 * Loading indicator shown while a fetch is in flight.
 *
 * @param {string} [label='Loading…'] - text under the spinner, also the
 *   accessible name announced to screen readers
 * @param {boolean} [inline=false] - render compactly inside a card rather
 *   than as a full-height block
 */
export default function Spinner({ label = 'Loading…', inline = false }) {
  return (
    <div className={inline ? 'spinner-wrap spinner-wrap--inline' : 'spinner-wrap'} role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-label">{label}</p>
    </div>
  );
}
