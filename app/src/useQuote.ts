import { useEffect, useState } from 'react';

import { ApiError } from './api/client';

/**
 * Fetches a quote whenever its inputs change, after a short pause in typing.
 * Pass `null` as the fetcher when the inputs are incomplete.
 */
export function useQuote<T>(fetcher: (() => Promise<T>) | null, deps: unknown[]) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setData(undefined);
    setError(undefined);
    if (!fetcher) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      fetcher()
        .then((result) => !cancelled && setData(result))
        .catch((e) => !cancelled && setError(e instanceof ApiError ? e.message : String(e)));
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error };
}
