import { useEffect } from 'react';

/**
 * Modal confirmation for destructive actions.
 *
 * Used before deleting a listing. A real dialog rather than window.confirm
 * so it matches the dashboard's styling, can show the listing's name, and
 * can hold a busy state while the delete is in flight.
 *
 * @param {boolean} open
 * @param {string} title
 * @param {React.ReactNode} children - the explanatory body text
 * @param {string} [confirmLabel='Delete']
 * @param {boolean} [busy=false] - disables both buttons and shows progress
 * @param {Function} onConfirm
 * @param {Function} onCancel
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Delete',
  busy = false,
  onConfirm,
  onCancel,
}) {
  // Escape closes the dialog, and the page behind must not scroll while it
  // is open. Escape is ignored mid-delete so the request is not orphaned.
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        // Only a click on the backdrop itself closes, and never mid-delete.
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div className="confirm" role="alertdialog" aria-modal="true" aria-label={title}>
        <h2 className="confirm__title">{title}</h2>
        <div className="confirm__body">{children}</div>

        <div className="confirm__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>
            Keep it
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
