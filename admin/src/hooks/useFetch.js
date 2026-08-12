import { useCallback, useEffect, useState } from 'react';

/**
 * Run an async function and track its loading / error / data states.
 *
 * Every screen needs the same three-state handling around a fetch, so it
 * lives here once rather than being repeated in each page.
 *
 * @param {Function} fetcher - async function returning the data
 * @param {any[]} deps - re-runs the fetcher when these change
 * @returns {{data, loading, error, refetch}}
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
    // Set on cleanup so a response arriving after the user has navigated
    // away cannot write to unmounted state or overwrite a newer result.
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
