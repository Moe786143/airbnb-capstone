import { useCallback, useEffect, useState } from 'react';

/**
 * Run an async function and track its loading / error / data states.
 *
 * Every screen in the app needs the same three-state handling around a
 * fetch, so it lives here once rather than being repeated in each page.
 *
 * @param {Function} fetcher - async function returning the data
 * @param {any[]} deps - re-runs the fetcher when these change
 * @returns {{data, loading, error, refetch}}
 *
 * @example
 *   const { data, loading, error } = useFetch(() => getAccommodation(id), [id]);
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Bumping this re-runs the effect, which is how refetch() works.
  const [attempt, setAttempt] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runFetch = useCallback(fetcher, deps);

  useEffect(() => {
    // Set when the effect is cleaned up, so a response that arrives after
    // the user has navigated away cannot write to unmounted state or
    // overwrite a newer request's result.
    let cancelled = false;

    setLoading(true);
    setError(null);

    runFetch()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [runFetch, attempt]);

  /** Re-run the fetch — wired to the "Try again" button on error states. */
  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, refetch };
}
