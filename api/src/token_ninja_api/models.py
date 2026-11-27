from decimal import Decimal

from sqlalchemy import Boolean, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from token_ninja_api.db import Base

# Plenty of precision for small-unit currencies and fractional ratios.
Rate = Numeric(precision=20, scale=8)


class Currency(Base):
    """A fiat currency that can be converted into tokens."""

    __tablename__ = "currencies"

    code: Mapped[str] = mapped_column(String(3), primary_key=True)
    name: Mapped[str] = mapped_column(String(64))
    tokens_per_unit: Mapped[Decimal] = mapped_column(Rate)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Vendor(Base):
    """A compute vendor where tokens are redeemed.

    Each vendor sets its own price in tokens, the way a credit card's reward points are worth
    different amounts at different airlines or stores.
    """

    __tablename__ = "vendors"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128))
    unit: Mapped[str] = mapped_column(String(64))
    tokens_per_unit: Mapped[Decimal] = mapped_column(Rate)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
