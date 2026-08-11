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
      {/* Heading: what kind of place this is and where */}
      <header className="detail-header">
        <h1 className="detail-header__title">
          {accommodation.type} in {accommodation.location}
        </h1>
        <div className="detail-header__meta">
          <span className="detail-header__rating">
            <StarIcon />
            <strong>{formatRating(accommodation.rating)}</strong>
          </span>
          <span className="detail-header__dot">&middot;</span>
          <span className="detail-header__reviews">{accommodation.reviews} reviews</span>
          <span className="detail-header__dot">&middot;</span>
          <span className="detail-header__location">{accommodation.location}</span>
        </div>
        <p className="detail-header__name">{accommodation.title}</p>
      </header>

      <ImageGallery images={accommodation.images} title={accommodation.title} />

      <div className="detail-layout">
        {/* LEFT: the descriptive sections */}
        <div className="detail-layout__main">
          <Overview accommodation={accommodation} />
          <WhereYouSleep bedrooms={accommodation.bedrooms} />
          <Amenities amenities={accommodation.amenities} />
          <StayCalendar
            nights={nights}
            location={accommodation.location}
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
          />
          <Reviews
            rating={accommodation.rating}
            reviews={accommodation.reviews}
            specificRatings={accommodation.specificRatings}
          />
          <HostDetails host={accommodation.host} reviews={accommodation.reviews} />
          <ThingsToKnow
            selfCheckIn={accommodation.selfCheckIn}
            enhancedCleaning={accommodation.enhancedCleaning}
            guests={accommodation.guests}
          />
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
        </div>
      </div>
    </div>
  );
}
