"""Create tables and load currencies and vendors from config/rates.yaml.

Safe to run again: existing rows are updated in place.
"""

from decimal import Decimal
from pathlib import Path

import yaml
from sqlalchemy.orm import Session

from token_ninja_api.db import Base, get_engine
from token_ninja_api.models import Currency, Vendor
from token_ninja_api.settings import get_settings


def load_seed(session: Session, seed_file: Path) -> None:
    data = yaml.safe_load(seed_file.read_text())
    for row in data.get("currencies", []):
        session.merge(
            Currency(
                code=row["code"].upper(),
                name=row["name"],
                tokens_per_unit=Decimal(str(row["tokens_per_unit"])),
                active=row.get("active", True),
            )
        )
    for row in data.get("vendors", []):
        session.merge(
            Vendor(
                id=row["id"],
                name=row["name"],
                unit=row["unit"],
                tokens_per_unit=Decimal(str(row["tokens_per_unit"])),
                active=row.get("active", True),
            )
        )
    session.commit()


def main() -> None:
    engine = get_engine()
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        load_seed(session, get_settings().seed_file)
    print("Seeded currencies and vendors.")


if __name__ == "__main__":
    main()
