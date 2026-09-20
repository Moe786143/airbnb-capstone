import { API_URL } from '../../api/client';

// Served from backend/public/images/ the same way the seeded listing
// photos are — this is the actual bedroom photo you sent (not a
// substitute), used the same way on every listing since Figma shows one
// fixed representative photo here rather than a per-listing one.
const BEDROOM_IMAGE = `${API_URL.replace(/\/api$/, '')}/images/where-you-sleep-bedroom.png`;

/**
 * "Where you'll sleep" — Figma shows one fixed photo (320px wide) with a
 * "Bedroom" / "1 queen bed" caption underneath, not a grid of every
 * bedroom in the listing. There's no per-room photo in the data model, so
 * this is the same photo and caption on every listing.
 */
export default function WhereYouSleep() {
  return (
    <section className="detail-section">
      <h2 className="detail-section__title">Where you&apos;ll sleep</h2>

      <figure className="sleep-thumb">
        <img src={BEDROOM_IMAGE} alt="" className="sleep-thumb__image" />
        <figcaption>
          <p className="sleep-thumb__name">Bedroom</p>
          <p className="sleep-thumb__beds">1 queen bed</p>
        </figcaption>
      </figure>
    </section>
  );
}
