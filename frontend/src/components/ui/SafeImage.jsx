import { useState } from 'react';

/**
 * A neutral grey placeholder shown when an image URL fails to load.
 * Inlined as a data URI so it needs no network request of its own.
 */
const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ebebeb'/%3E%3Cpath d='M160 120h80v60h-80z' fill='%23d4d4d4'/%3E%3Ccircle cx='185' cy='140' r='8' fill='%23ebebeb'/%3E%3Cpath d='M160 180l25-30 20 22 15-14 20 22z' fill='%23ebebeb'/%3E%3C/svg%3E";

/**
 * An <img> that degrades gracefully.
 *
 * Listing images come from remote URLs that may be missing or rate-limited;
 * without this the page would show broken-image icons. Falls back to a
 * placeholder on error and lazy-loads by default so long grids of cards do
 * not fetch every image up front.
 *
 * @param {string} src
 * @param {string} alt
 * @param {string} [className]
 */
export default function SafeImage({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={className}
      src={failed || !src ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
