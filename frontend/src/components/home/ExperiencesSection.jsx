/**
 * "Discover Airbnb Experiences" — two large promo panels side by side.
 *
 * Each panel is a background photo with a title and a static button, one
 * for in-person experiences and one for online ones. The buttons are
 * deliberately inert: Experiences are out of scope for this build.
 */

/** The two panels, as data so the markup is written once. */
const PANELS = [
  {
    title: 'Things to do on your trip',
    copy: 'Book unforgettable activities hosted by locals — from pasta making in Rome to surfing at dawn.',
    button: 'Experiences',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=70',
  },
  {
    title: 'Things to do at home',
    copy: 'Join live, interactive sessions with hosts around the world without leaving your sofa.',
    button: 'Online Experiences',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=70',
  },
];

export default function ExperiencesSection() {
  return (
    <section className="section container">
      <h2 className="section__title">Discover Airbnb Experiences</h2>

      <div className="experiences">
        {PANELS.map((panel) => (
          <article
            className="experience-card"
            key={panel.title}
            style={{ backgroundImage: `url(${panel.image})` }}
          >
            <div className="experience-card__overlay" />
            <div className="experience-card__content">
              <h3 className="experience-card__title">{panel.title}</h3>
              <p className="experience-card__copy">{panel.copy}</p>
              <button type="button" className="btn btn--white">
                {panel.button}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
