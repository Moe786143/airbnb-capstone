import sandtonPhoto from '../../assets/inspiration/sandton-city-hotel.png';
import joburgPhoto from '../../assets/inspiration/joburg-city-hotel.png';
import woodmeadPhoto from '../../assets/inspiration/woodmead-hotel.png';
import hydeParkPhoto from '../../assets/inspiration/hyde-park-hotel.png';

/**
 * "Inspiration for your next trip" — four featured South African
 * properties shown as big photo cards with a colored title strip, matching
 * the Figma "City Card" component. Purely presentational — the cards don't
 * link anywhere, just a hover lift for a bit of life.
 */
const CITY_CARDS = [
  {
    name: 'Sandton City Hotel',
    distance: '53 km away',
    image: sandtonPhoto,
    accent: '#CC2D4A',
  },
  {
    name: 'Joburg City Hotel',
    distance: '168 km away',
    image: joburgPhoto,
    accent: 'linear-gradient(135deg, #A62D6B 0%, #D9435F 100%)',
  },
  {
    name: 'Woodmead Hotel',
    distance: '30 miles away',
    image: woodmeadPhoto,
    accent: '#C0392B',
  },
  {
    name: 'Hyde Park Hotel',
    distance: '34 km away',
    image: hydeParkPhoto,
    accent: '#D9622B',
  },
];

export default function InspirationGrid() {
  return (
    <section className="section container">
      <h2 className="section__title">Inspiration for your next trip</h2>

      <div className="inspiration-row">
        {CITY_CARDS.map((card) => (
          <div key={card.name} className="city-card">
            <img src={card.image} alt={card.name} className="city-card__image" />
            <div className="city-card__content" style={{ background: card.accent }}>
              <span className="city-card__title">{card.name}</span>
              <span className="city-card__distance">{card.distance}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
