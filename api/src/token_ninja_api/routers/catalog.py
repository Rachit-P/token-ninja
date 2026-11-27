from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from token_ninja_api.db import get_session
from token_ninja_api.models import Currency, Vendor
from token_ninja_api.schemas import CurrencyOut, VendorOut

router = APIRouter(tags=["catalog"])
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/currencies", response_model=list[CurrencyOut])
def list_currencies(session: SessionDep) -> list[Currency]:
    return list(session.scalars(select(Currency).where(Currency.active).order_by(Currency.code)))


@router.get("/vendors", response_model=list[VendorOut])
def list_vendors(session: SessionDep) -> list[Vendor]:
    return list(session.scalars(select(Vendor).where(Vendor.active).order_by(Vendor.name)))
