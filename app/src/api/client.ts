import type { components } from './schema';

type Schemas = components['schemas'];
export type Currency = Schemas['CurrencyOut'];
export type Vendor = Schemas['VendorOut'];
export type PurchaseQuote = Schemas['PurchaseQuoteOut'];
export type RedemptionQuote = Schemas['RedemptionQuoteOut'];

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(`Can't reach the API at ${BASE_URL}`);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = typeof body?.detail === 'string' ? body.detail : `Request failed (${res.status})`;
    throw new ApiError(detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listCurrencies: () => request<Currency[]>('/v1/currencies'),
  listVendors: () => request<Vendor[]>('/v1/vendors'),
  quotePurchase: (currency: string, amount: string) =>
    request<PurchaseQuote>('/v1/quotes/purchase', {
      method: 'POST',
      body: JSON.stringify({ currency, amount }),
    }),
  quoteRedemption: (vendorId: string, tokens: string) =>
    request<RedemptionQuote>('/v1/quotes/redemption', {
      method: 'POST',
      body: JSON.stringify({ vendor_id: vendorId, tokens }),
    }),
};
