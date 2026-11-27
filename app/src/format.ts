/** Show API decimal strings without trailing zeros, e.g. "250.00000000" -> "250". */
export function trimDecimal(value: string): string {
  return value.includes('.') ? value.replace(/\.?0+$/, '') : value;
}

/** Accept only digits and one decimal point while typing an amount. */
export function sanitizeAmount(input: string): string {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  return rest.length ? `${whole}.${rest.join('')}` : whole;
}
