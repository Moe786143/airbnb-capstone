import SafeImage from '../ui/SafeImage';

/**
 * "Shop Airbnb" — a two-column band promoting gift cards.
 *
 * Copy and a static button in the left column, the gift card artwork in the
 * right. Stacks to one column on small screens.
 */
export default function ShopAirbnb() {
  return (
    <section className="section container">
      <div className="shop">
        <div className="shop__text">
          <h2 className="shop__title">Shop Airbnb gift cards</h2>
          <p className="shop__copy">
            Give the gift of travel. Airbnb gift cards never expire and can be
            used towards any stay or experience, anywhere in the world.
          </p>
          <button type="button" className="btn btn--dark">
            Shop now
          </button>
        </div>

        <div className="shop__media">
          <SafeImage
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=70"
            alt="An Airbnb gift card presented in a wrapped box"
            className="shop__image"
          />
        </div>
      </div>
    </section>
  );
}
