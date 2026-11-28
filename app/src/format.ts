/** Longest amount we accept: 12 whole digits and 8 decimals, matching the API's limits. */
export const MAX_WHOLE_DIGITS = 12;
export const MAX_DECIMALS = 8;

/** Show API decimal strings without trailing zeros, e.g. "250.00000000" -> "250". */
export function trimDecimal(value: string): string {
  return value.includes('.') ? value.replace(/\.?0+$/, '') : value;
}

/**
 * Accept only digits and one decimal point while typing an amount, capped at the API's limits
 * so the user never types something the API will reject.
 */
export function sanitizeAmount(input: string): string {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  const wholePart = whole.replace(/^0+(?=\d)/, '').slice(0, MAX_WHOLE_DIGITS);
  if (!rest.length) return wholePart;
  return `${wholePart}.${rest.join('').slice(0, MAX_DECIMALS)}`;
}

/** True when the text is a complete, positive number worth asking the API about. */
export function isPositiveAmount(value: string): boolean {
  return /^\d*\.?\d+$|^\d+\.$/.test(value) && Number(value) > 0;
}
