import SafeImage from '../ui/SafeImage';

/**
 * The photo gallery at the top of the details page.
 *
 * One large image on the left with four smaller ones in a 2x2 grid on the
 * right. Listings in the seed data carry two or three photos, so the array
 * is cycled to fill all five slots rather than leaving gaps.
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
          </div>
        ))}
      </div>
    </section>
  );
}
