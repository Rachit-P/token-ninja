import type { components } from './schema';

type Schemas = components['schemas'];
export type Currency = Schemas['CurrencyOut'];
export type Vendor = Schemas['VendorOut'];
export type PurchaseQuote = Schemas['PurchaseQuoteOut'];
export type RedemptionQuote = Schemas['RedemptionQuoteOut'];

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
/** Give up on a request after this long instead of waiting forever on a hung connection. */
const TIMEOUT_MS = 10_000;

export class ApiError extends Error {}

/** Thrown when the caller cancelled the request; callers should ignore it, not show it. */
export class AbortedError extends Error {}

type Options = { method?: string; body?: unknown; signal?: AbortSignal };

async function request<T>(path: string, { method = 'GET', body, signal }: Options = {}): Promise<T> {
  // One controller per request, fired by either the caller's signal or the timeout.
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  const onCallerAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', onCallerAbort);

  try {
    let res: Response;
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      if (timedOut) throw new ApiError('The API took too long to respond. Try again.');
      if (signal?.aborted) throw new AbortedError();
      throw new ApiError(`Can't reach the API at ${BASE_URL}`);
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new ApiError(errorMessage(payload, res.status));
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }
}

/** FastAPI sends `detail` as a string, or as a list of validation errors for a 422. */
function errorMessage(payload: unknown, status: number): string {
  const detail = (payload as { detail?: unknown } | null)?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && typeof detail[0]?.msg === 'string') {
    return status === 422 ? `Check the amount: ${detail[0].msg}` : detail[0].msg;
  }
  return `Request failed (${status})`;
}

export const api = {
  listCurrencies: (signal?: AbortSignal) => request<Currency[]>('/v1/currencies', { signal }),
  listVendors: (signal?: AbortSignal) => request<Vendor[]>('/v1/vendors', { signal }),
  quotePurchase: (currency: string, amount: string, signal?: AbortSignal) =>
    request<PurchaseQuote>('/v1/quotes/purchase', {
      method: 'POST',
      body: { currency, amount },
      signal,
    }),
  quoteRedemption: (vendorId: string, tokens: string, signal?: AbortSignal) =>
    request<RedemptionQuote>('/v1/quotes/redemption', {
      method: 'POST',
      body: { vendor_id: vendorId, tokens },
      signal,
    }),
};
