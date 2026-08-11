import { useEffect } from 'react';

/**
 * Generic centred modal dialog with a dark overlay.
 *
 * Handles the behaviour every dialog needs: closing on Escape or on an
 * overlay click, and locking body scroll while open so the page behind does
 * not move. Used by the login dialog and the reservations dialog.
 *
 * @param {boolean} open
 * @param {Function} onClose
 * @param {string} title - rendered in the header and used as the a11y label
 * @param {string} [size='sm'] - 'sm' for forms, 'lg' for the reservations table
 * @param {React.ReactNode} children
 */
export default function Modal({ open, onClose, title, size = 'sm', children }) {
  // Close on Escape, and prevent the page behind from scrolling.
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      // Only a click on the overlay itself closes — not one that bubbled up
      // from the dialog contents.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal__header">
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &#10005;
          </button>
          <h2 className="modal__title">{title}</h2>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
