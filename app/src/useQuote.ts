import { useEffect, useRef, useState } from 'react';

import { AbortedError, ApiError } from './api/client';

const DEBOUNCE_MS = 300;

export type QuoteState<T> = {
  /** The latest quote for the current inputs, or the previous one while a new one loads. */
  data: T | undefined;
  error: string | undefined;
  /** True while a newer quote is on its way, so the UI can mark `data` as out of date. */
  pending: boolean;
};

/**
 * Fetches a quote when `key` changes, after a short pause in typing.
 *
 * - `key` identifies the inputs (e.g. "USD|25"); pass `null` while the inputs are incomplete.
 * - Only the newest request can update state, and older in-flight requests are aborted, so a
 *   slow earlier response can never overwrite a newer one.
 * - The previous result stays on screen (marked pending) instead of flickering away on every
 *   keystroke.
 */
export function useQuote<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
): QuoteState<T> {
  const [state, setState] = useState<QuoteState<T>>({
    data: undefined,
    error: undefined,
    pending: false,
  });
  // Always call the latest fetcher without making it an effect dependency.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (key === null) {
      setState({ data: undefined, error: undefined, pending: false });
      return;
    }
    setState((s) => ({ ...s, pending: true }));
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetcherRef
        .current(controller.signal)
        .then((data) => setState({ data, error: undefined, pending: false }))
        .catch((e) => {
          if (e instanceof AbortedError || controller.signal.aborted) return;
          const error = e instanceof ApiError ? e.message : String(e);
          setState({ data: undefined, error, pending: false });
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key]);

  return state;
}
