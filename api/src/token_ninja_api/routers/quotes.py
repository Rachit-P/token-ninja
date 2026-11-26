from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from token_ninja_api.conversion import currency_to_tokens, tokens_to_vendor_units
from token_ninja_api.db import get_session
from token_ninja_api.models import Currency, Vendor
from token_ninja_api.schemas import (
    PurchaseQuoteIn,
    PurchaseQuoteOut,
    RedemptionQuoteIn,
    RedemptionQuoteOut,
)

router = APIRouter(prefix="/quotes", tags=["quotes"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/purchase", response_model=PurchaseQuoteOut)
def quote_purchase(body: PurchaseQuoteIn, session: SessionDep) -> PurchaseQuoteOut:
    """How many tokens a currency amount buys."""
    code = body.currency.upper()
    currency = session.get(Currency, code)
    if currency is None or not currency.active:
        raise HTTPException(status_code=404, detail=f"Unknown currency: {code}")
    return PurchaseQuoteOut(
        currency=currency.code,
        amount=body.amount,
        tokens_per_unit=currency.tokens_per_unit,
        tokens=currency_to_tokens(body.amount, currency.tokens_per_unit),
    )


@router.post("/redemption", response_model=RedemptionQuoteOut)
def quote_redemption(body: RedemptionQuoteIn, session: SessionDep) -> RedemptionQuoteOut:
    """How much of a vendor's compute a number of tokens is worth."""
    vendor = session.get(Vendor, body.vendor_id)
    if vendor is None or not vendor.active:
        raise HTTPException(status_code=404, detail=f"Unknown vendor: {body.vendor_id}")
    return RedemptionQuoteOut(
        vendor_id=vendor.id,
        tokens=body.tokens,
        tokens_per_unit=vendor.tokens_per_unit,
        unit=vendor.unit,
        units=tokens_to_vendor_units(body.tokens, vendor.tokens_per_unit),
    )
