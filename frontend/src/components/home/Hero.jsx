import { useNavigate } from 'react-router-dom';

/**
 * The full-width hero banner at the top of the home page.
 *
 * A background photo with a dark gradient over it for text contrast, a
 * headline, a subheadline, and a call to action that sends the visitor
 * straight to the locations page.
 */
export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="hero"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=75)',
      }}
    >
      <div className="hero__overlay" />

      <div className="container hero__content">
        <p className="hero__eyebrow">Not sure where to go? Perfect.</p>
        <h1 className="hero__title">
          Find your next stay,
          <br />
          anywhere in the world
        </h1>
        <p className="hero__subtitle">
          From cliffside cabins to city lofts — book unique places to stay from
          hosts who make you feel at home.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => navigate('/locations')}
        >
          Explore stays
        </button>
      </div>
    </section>
  );
}
