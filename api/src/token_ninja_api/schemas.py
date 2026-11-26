from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CurrencyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    name: str
    tokens_per_unit: Decimal


class VendorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    unit: str
    tokens_per_unit: Decimal


class PurchaseQuoteIn(BaseModel):
    currency: str = Field(min_length=3, max_length=3, examples=["USD"])
    amount: Decimal = Field(gt=0, examples=["25.00"])


class PurchaseQuoteOut(BaseModel):
    currency: str
    amount: Decimal
    tokens_per_unit: Decimal
    tokens: Decimal


class RedemptionQuoteIn(BaseModel):
    vendor_id: str = Field(examples=["gpu-cloud"])
    tokens: Decimal = Field(gt=0, examples=["500"])


class RedemptionQuoteOut(BaseModel):
    vendor_id: str
    tokens: Decimal
    tokens_per_unit: Decimal
    unit: str
    units: Decimal
