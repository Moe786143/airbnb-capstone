import SafeImage from '../ui/SafeImage';

/**
 * The photo gallery at the top of the details page.
 *
 * One large image on the left with four smaller ones in a 2x2 grid on the
 * right, and a "Show all photos" pill overlaid on the bottom-right
 * thumbnail (Figma's exact placement). Listings in the seed data carry two
 * or three photos, so the array is cycled to fill all five slots rather
 * than leaving gaps.
 *
 * The button itself is real and hoverable but doesn't open anything — this
 * app has no photo lightbox built, so it gets the same "looks interactive,
 * does nothing" treatment as this page's other decorative controls.
 *
 * @param {string[]} images - image URLs from the listing
 * @param {string} title - used for the alt text
 */
export default function ImageGallery({ images = [], title }) {
  // Build exactly five slots, repeating the available photos as needed.
  const slots = Array.from({ length: 5 }, (_, index) =>
    images.length > 0 ? images[index % images.length] : null
  );

  const [main, ...thumbnails] = slots;
  const lastIndex = thumbnails.length - 1;

  return (
    <section className="gallery" aria-label="Photos of this place">
      <div className="gallery__main">
        <SafeImage src={main} alt={`${title} — main photo`} className="gallery__image" />
      </div>

      <div className="gallery__grid">
        {thumbnails.map((image, index) => (
          // Index keys are correct here: the slots are positional and the
          // same photo can legitimately appear twice.
          <div className="gallery__cell" key={index}>
            <SafeImage
              src={image}
              alt={`${title} — photo ${index + 2}`}
              className="gallery__image"
            />

            {index === lastIndex && (
              <button type="button" className="gallery__show-all">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Show all photos
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
