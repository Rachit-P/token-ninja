from decimal import Decimal

import pytest

from token_ninja_api.conversion import (
    ConversionError,
    currency_to_tokens,
    tokens_to_vendor_units,
)


def test_currency_to_tokens_rounds_down():
    assert currency_to_tokens(Decimal("10.555"), Decimal("1.2")) == Decimal("12.66")


def test_tokens_to_vendor_units_rounds_down():
    assert tokens_to_vendor_units(Decimal("100"), Decimal("3")) == Decimal("33.3333")


@pytest.mark.parametrize("amount", [Decimal("0"), Decimal("-1")])
def test_rejects_non_positive_amounts(amount):
    with pytest.raises(ConversionError):
        currency_to_tokens(amount, Decimal("100"))
    with pytest.raises(ConversionError):
        tokens_to_vendor_units(amount, Decimal("100"))


def test_rejects_non_positive_rates():
    with pytest.raises(ConversionError):
        currency_to_tokens(Decimal("1"), Decimal("0"))
    with pytest.raises(ConversionError):
        tokens_to_vendor_units(Decimal("1"), Decimal("0"))
