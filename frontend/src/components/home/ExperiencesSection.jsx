import tripPhoto from '../../assets/experiences/things-to-do-on-your-trip.png';
import homePhoto from '../../assets/experiences/things-to-do-from-home.png';

/**
 * "Discover Airbnb Experiences" — two square promo panels side by side.
 *
 * Both photos are the actual reference exports, title, button and all
 * baked into the pixels, so the cards are just the images — no live text
 * or button rendered on top of them. Purely presentational: no click
 * behaviour, just a hover lift for a bit of life.
 */
const PANELS = [
  { alt: 'Things to do on your trip — Experiences', image: tripPhoto },
  { alt: 'Things to do from home — Online Experiences', image: homePhoto },
];

export default function ExperiencesSection() {
  return (
    <section className="section container">
      <h2 className="section__title">Discover Airbnb Experiences</h2>

      <div className="experiences">
        {PANELS.map((panel) => (
          <article
            className="experience-card"
            key={panel.alt}
            style={{ backgroundImage: `url(${panel.image})` }}
            role="img"
            aria-label={panel.alt}
          />
        ))}
      </div>
    </section>
  );
}
