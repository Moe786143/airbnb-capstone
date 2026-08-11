/**
 * The filled star used next to every rating in the app.
 * Inline SVG so it inherits colour from `currentColor` and needs no icon
 * library.
 *
 * @param {number} [size=14] - width and height in pixels
 */
export default function StarIcon({ size = 14, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 00-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 001.483 1.061L16 25.951l8.625 4.997a1 1 0 001.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 00-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 00-1.814 0z" />
    </svg>
  );
}
