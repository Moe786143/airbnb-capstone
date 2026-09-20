import bannerPhoto from '../../assets/hosting/questions-about-hosting.png';

/**
 * "Questions about hosting?" — a single full-width banner between the gift
 * cards band and "Inspiration for future getaways".
 *
 * The photo is the actual Figma export at its exact 1280x640 size, title
 * and "Ask a Superhost" button already baked into the pixels. A real,
 * invisible button sits exactly on top of the baked-in button (its pixel
 * position measured from the image: 80,504 to 253,559 in the 1280x640
 * original, expressed below as percentages so it stays aligned as the
 * banner scales) so hovering that specific spot gives real feedback,
 * rather than the whole banner reacting. Purely presentational otherwise
 * — the button doesn't lead anywhere.
 */
export default function SuperhostBanner() {
  return (
    <section className="section container">
      <div
        className="superhost-banner"
        style={{ backgroundImage: `url(${bannerPhoto})` }}
        role="img"
        aria-label="Questions about hosting?"
      >
        <button
          type="button"
          className="superhost-banner__cta"
          aria-label="Ask a Superhost"
        />
      </div>
    </section>
  );
}
