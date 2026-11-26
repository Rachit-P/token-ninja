"""Pure conversion math. No database or web code here, so it is easy to test and reuse
(for example from future SIP and SWP scheduled jobs)."""

from decimal import ROUND_DOWN, Decimal

TOKEN_QUANTUM = Decimal("0.01")
UNIT_QUANTUM = Decimal("0.0001")


class ConversionError(ValueError):
    pass


def currency_to_tokens(amount: Decimal, tokens_per_unit: Decimal) -> Decimal:
    """Tokens received for `amount` of a currency. Rounds down so we never over-issue."""
    if amount <= 0:
        raise ConversionError("amount must be greater than zero")
    if tokens_per_unit <= 0:
        raise ConversionError("currency rate must be greater than zero")
    return (amount * tokens_per_unit).quantize(TOKEN_QUANTUM, rounding=ROUND_DOWN)


def tokens_to_vendor_units(tokens: Decimal, tokens_per_unit: Decimal) -> Decimal:
    """Compute units a vendor gives for `tokens`. Rounds down so we never over-redeem."""
    if tokens <= 0:
        raise ConversionError("tokens must be greater than zero")
    if tokens_per_unit <= 0:
        raise ConversionError("vendor rate must be greater than zero")
    return (tokens / tokens_per_unit).quantize(UNIT_QUANTUM, rounding=ROUND_DOWN)
