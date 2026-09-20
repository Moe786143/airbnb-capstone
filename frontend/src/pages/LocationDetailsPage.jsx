import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ImageGallery from '../components/details/ImageGallery';
import Overview from '../components/details/Overview';
import WhereYouSleep from '../components/details/WhereYouSleep';
import Amenities from '../components/details/Amenities';
import StayCalendar from '../components/details/StayCalendar';
import Reviews from '../components/details/Reviews';
import HostDetails from '../components/details/HostDetails';
import ThingsToKnow from '../components/details/ThingsToKnow';
import CostCalculator from '../components/details/CostCalculator';
import ExploreLinks from '../components/details/ExploreLinks';
import StarIcon from '../components/ui/StarIcon';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getAccommodation } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { countNights, formatRating, toInputDate } from '../utils/format';

/**
 * Work out a sensible opening date range: a seven-night stay starting a
 * week from today. Starting with real dates means the cost calculator and
 * the "7 nights in <city>" section both show live figures immediately,
 * rather than an empty state the visitor has to fill in first.
 *
 * @returns {{checkIn: string, checkOut: string}} ISO date strings
 */
const defaultDates = () => {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 7);

  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 7);

  return { checkIn: toInputDate(checkIn), checkOut: toInputDate(checkOut) };
};

/**
 * The listing details page at `/locations/:id`.
 *
 * Fetches one accommodation and lays it out in two columns: the static
 * detail sections on the left, the sticky cost calculator on the right.
 *
 * The booking dates and guest count are held here rather than inside the
 * calculator, because the "N nights in <city>" section needs to display the
 * same range — one source of truth, two consumers.
 */
export default function LocationDetailsPage() {
  const { id } = useParams();

  const fetcher = useCallback(() => getAccommodation(id), [id]);
  const { data: accommodation, loading, error, refetch } = useFetch(fetcher, [id]);

  const [booking, setBooking] = useState(() => ({ ...defaultDates(), guests: 1 }));

  /** Merge a partial change from the calculator into the booking state. */
  const updateBooking = (patch) => setBooking((current) => ({ ...current, ...patch }));

  // Save/heart toggle in the page heading — visual only, resets on reload,
  // same treatment as the heart on the listing cards.
  const [saved, setSaved] = useState(false);

  if (loading) {
    return (
      <div className="container page">
        <Spinner label="Loading this place…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <ErrorMessage
          title="We couldn't load this place"
          message={error}
          onRetry={refetch}
        />
        <p className="back-link-wrap">
          <Link to="/locations" className="link-button">
            &larr; Back to all stays
          </Link>
        </p>
      </div>
    );
  }

  // A valid id that matches nothing returns 404 and lands in `error` above;
  // this guards the theoretical case of a 200 with an empty body.
  if (!accommodation) return null;

  const nights = countNights(booking.checkIn, booking.checkOut);

  return (
    <div className="container page">
      {/* Heading: the listing's name, its rating/reviews/Superhost/location
          line, and the Share/Save controls — Figma's exact heading row. */}
      <header className="detail-header">
        <div className="detail-header__top">
          <h1 className="detail-header__title">{accommodation.title}</h1>

          <div className="detail-header__actions">
            <button type="button" className="detail-header__action">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path
                  d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 3h6v6M10 14L21 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Share
            </button>

            <button
              type="button"
              className={`detail-header__action${saved ? ' detail-header__action--saved' : ''}`}
              aria-pressed={saved}
              onClick={() => setSaved((current) => !current)}
            >
              <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true">
                <path
                  d="M16 28s-11-6.7-11-15A6.5 6.5 0 0 1 16 9.5 6.5 6.5 0 0 1 27 13c0 8.3-11 15-11 15z"
                  fill={saved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              Save
            </button>
          </div>
        </div>

        <div className="detail-header__meta">
          <span className="detail-header__rating">
            <StarIcon />
            <strong>{formatRating(accommodation.rating)}</strong>
          </span>
          <span className="detail-header__dot">&middot;</span>
          <button type="button" className="detail-header__reviews">
            {accommodation.reviews} reviews
          </button>
          <span className="detail-header__dot">&middot;</span>
          <span className="detail-header__superhost">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L12 14.9l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L12 2z" />
            </svg>
            Superhost
          </span>
          <span className="detail-header__dot">&middot;</span>
          <button type="button" className="detail-header__location">
            {accommodation.location}
          </button>
        </div>
      </header>

      <ImageGallery images={accommodation.images} title={accommodation.title} />

      <div className="detail-layout">
        {/* LEFT: the descriptive sections */}
        <div className="detail-layout__main">
          <Overview accommodation={accommodation} />
          <WhereYouSleep />
          <Amenities />
          <StayCalendar
            nights={nights}
            location={accommodation.location}
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            onChange={updateBooking}
          />
          <Reviews />
          <HostDetails host={accommodation.host} />
          <ThingsToKnow />
        </div>

        {/* RIGHT: the sticky booking card */}
        <div className="detail-layout__aside">
          <CostCalculator
            accommodation={accommodation}
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            guests={booking.guests}
            onChange={updateBooking}
          />

          <button type="button" className="report-listing">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M5 3v18M5 4h12l-2.5 4L17 12H5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Report this listing
          </button>
        </div>
      </div>

      <ExploreLinks />
    </div>
  );
}
