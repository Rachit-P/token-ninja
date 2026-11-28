from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer

# Decimals go over the wire as plain fixed-point strings ("100.00", never "1E+2"), so clients
# can show them as-is and never have to parse scientific notation.
FixedDecimal = Annotated[
    Decimal, PlainSerializer(lambda d: format(d, "f"), return_type=str, when_used="json")
]

# Inputs are bounded so every result fits in Decimal's 28-digit precision. Larger values used
# to raise decimal.InvalidOperation and return a 500.
MAX_DIGITS = 20
MAX_DECIMALS = 8
PositiveAmount = Annotated[Decimal, Field(gt=0, max_digits=MAX_DIGITS, decimal_places=MAX_DECIMALS)]


class CurrencyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    name: str
    tokens_per_unit: FixedDecimal


class VendorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    unit: str
    tokens_per_unit: FixedDecimal


class PurchaseQuoteIn(BaseModel):
    currency: str = Field(min_length=3, max_length=3, examples=["USD"])
    amount: PositiveAmount = Field(examples=["25.00"])


class PurchaseQuoteOut(BaseModel):
    currency: str
    amount: FixedDecimal
    tokens_per_unit: FixedDecimal
    tokens: FixedDecimal


class RedemptionQuoteIn(BaseModel):
    vendor_id: str = Field(max_length=64, examples=["gpu-cloud"])
    tokens: PositiveAmount = Field(examples=["500"])


class RedemptionQuoteOut(BaseModel):
    vendor_id: str
    tokens: FixedDecimal
    tokens_per_unit: FixedDecimal
    unit: str
    units: FixedDecimal
