import giftCardsImage from '../../assets/shop/gift-cards.png';

/**
 * "Shop Airbnb gift cards" — a plain two-column band: a heading and a
 * static "Learn more" button on the left, the gift card artwork (the
 * actual Figma export, all three cards already composited into one
 * image) on the right. No card background or body copy — the Figma
 * section is just that, on the plain page background.
 *
 * Purely presentational — the button doesn't lead anywhere, just a
 * hover lift, same treatment as the other static sections on this page.
 */
export default function ShopAirbnb() {
  return (
    <section className="section container">
      <div className="shop">
        <div className="shop__text">
          <h2 className="shop__title">
            Shop Airbnb
            <br />
            gift cards
          </h2>
          <button type="button" className="btn btn--dark">
            Learn more
          </button>
        </div>

        <img src={giftCardsImage} alt="Airbnb gift cards" className="shop__image" />
      </div>
    </section>
  );
}
