import { Link } from 'react-router-dom';

/**
 * The Airbnb bélo mark plus a "Host dashboard" label, linking to the
 * listings page. The label makes it immediately clear this is the admin app
 * and not the customer site.
 */
export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Airbnb host dashboard — home">
      <svg
        className="logo__mark"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.633.9 2.383.899 3.517 0 3.55-2.488 5.988-5.756 5.988-2.192 0-4.55-1.283-6.615-3.583l-.353-.407-.353.407C14.284 28.716 11.926 30 9.734 30 6.466 30 3.978 27.562 3.978 24.012c0-1.134.233-1.884.9-3.517l.144-.353c.986-2.297 5.146-11.006 7.1-14.836l.533-1.025C13.943 1.963 15.398 1 16 1zm0 2c-.813 0-1.72.6-2.677 2.31l-.446.855c-1.925 3.774-6.03 12.37-6.99 14.606l-.13.315C5.19 22.65 5.02 23.194 5.02 24.012c0 2.44 1.626 3.988 3.756 3.988 1.686 0 3.71-1.147 5.5-3.276l.24-.293-.34-.42c-2.31-2.937-3.677-5.94-3.677-8.011 0-2.997 2.114-5 5.5-5s5.5 2.003 5.5 5c0 2.07-1.367 5.074-3.677 8.01l-.34.421.24.293c1.79 2.13 3.814 3.276 5.5 3.276 2.13 0 3.756-1.548 3.756-3.988 0-.818-.17-1.362-.737-2.926l-.13-.315c-.96-2.236-5.065-10.832-6.99-14.606l-.446-.855C17.72 3.6 16.813 3 16 3zm0 10c-2.281 0-3.5 1.155-3.5 3 0 1.5 1.09 3.94 3.03 6.46l.47.6.47-.6c1.94-2.52 3.03-4.96 3.03-6.46 0-1.845-1.219-3-3.5-3z" />
      </svg>
      <span className="logo__text">
        <span className="logo__word">airbnb</span>
        <span className="logo__sub">Host dashboard</span>
      </span>
    </Link>
  );
}
