import { useMemo, useState } from 'react';
import { formatLongDate, toInputDate } from '../../utils/format';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** Build a 6-week grid for a given month, including the leading/trailing
 *  days from adjacent months needed to fill the first/last week. */
function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date,
      iso: toInputDate(date),
      inMonth: date.getMonth() === month,
    };
  });
}

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

/**
 * The "<N> nights in <location>" band — Figma's real interactive two-month
 * date picker (670 x 452 Hug: 32px title/subtitle, the two month grids,
 * then the actions row), not just a visual stand-in. Clicking dates here
 * updates the same `checkIn`/`checkOut` the booking card uses, via the
 * `onChange` the page already passes to the cost calculator, so picking a
 * range here is immediately reflected in the price breakdown and vice
 * versa.
 *
 * @param {number} nights
 * @param {string} location
 * @param {string} checkIn - ISO date
 * @param {string} checkOut - ISO date
 * @param {(patch: {checkIn?: string, checkOut?: string}) => void} onChange
 */
export default function StayCalendar({ nights, location, checkIn, checkOut, onChange }) {
  const city = location?.split(',')[0] || location;

  // Which two months are on screen — starts on the check-in's month (or
  // this month if nothing's picked yet) and can be paged with the arrows
  // independently of the selected range.
  const [viewDate, setViewDate] = useState(() => {
    const base = checkIn ? new Date(`${checkIn}T12:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const months = useMemo(
    () => [0, 1].map((offset) => new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1)),
    [viewDate]
  );

  const goToPreviousMonth = () =>
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));

  const handleDayClick = (iso) => {
    const startSet = Boolean(checkIn);
    const endSet = Boolean(checkOut);

    if (!startSet || endSet) {
      // Nothing selected yet, or a full range is already selected —
      // either way this click starts a fresh range.
      onChange({ checkIn: iso, checkOut: '' });
      return;
    }

    if (iso <= checkIn) {
      // Clicked on or before the current check-in — restart from here.
      onChange({ checkIn: iso, checkOut: '' });
      return;
    }

    onChange({ checkOut: iso });
  };

  const handleClear = () => onChange({ checkIn: '', checkOut: '' });

  return (
    <section className="detail-section">
      <h2 className="detail-section__title">
        {nights > 0 ? `${nights} night${nights === 1 ? '' : 's'} in ${city}` : `Your stay in ${city}`}
      </h2>

      <p className="stay-dates">
        {checkIn && checkOut && nights > 0
          ? `${formatLongDate(checkIn)} — ${formatLongDate(checkOut)}`
          : 'Choose your dates to see your stay.'}
      </p>

      <div className="stay-calendar">
        <div className="stay-calendar__row">
          <button
            type="button"
            className="stay-calendar__nav"
            aria-label="Previous month"
            onClick={goToPreviousMonth}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="stay-calendar__grids">
            {months.map((monthDate) => (
              <div className="stay-calendar__month" key={monthDate.toISOString()}>
                <p className="stay-calendar__month-title">{MONTH_FORMATTER.format(monthDate)}</p>

                <div className="stay-calendar__weekdays">
                  {WEEKDAY_LABELS.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>

                <div className="stay-calendar__days">
                  {buildMonthGrid(monthDate.getFullYear(), monthDate.getMonth()).map((cell) => {
                    const isStart = cell.iso === checkIn;
                    const isEnd = Boolean(checkOut) && cell.iso === checkOut;
                    const isInRange =
                      checkIn && checkOut && cell.iso > checkIn && cell.iso < checkOut;

                    const classNames = ['stay-calendar__day'];
                    if (!cell.inMonth) classNames.push('stay-calendar__day--outside');
                    if (isStart || isEnd) classNames.push('stay-calendar__day--selected');
                    if (isInRange) classNames.push('stay-calendar__day--in-range');

                    return (
                      <button
                        type="button"
                        key={cell.iso}
                        className={classNames.join(' ')}
                        onClick={() => handleDayClick(cell.iso)}
                      >
                        {cell.date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="stay-calendar__nav"
            aria-label="Next month"
            onClick={goToNextMonth}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="stay-calendar__actions">
          {/* Figma shows a small grid icon here (a "flexible dates" toggle
              on the real Airbnb) with no defined behavior for this
              design — clickable, real hover feedback, no menu to open. */}
          <button type="button" className="stay-calendar__flex-toggle" aria-label="Flexible dates">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M8 3v18M16 3v18M3 8h18M3 16h18"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </button>

          <button type="button" className="stay-calendar__clear" onClick={handleClear}>
            Clear dates
          </button>
        </div>
      </div>
    </section>
  );
}
