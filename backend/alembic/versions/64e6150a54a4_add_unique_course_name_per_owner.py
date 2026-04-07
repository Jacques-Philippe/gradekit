"""add_unique_course_name_per_owner

Revision ID: 64e6150a54a4
Revises: 4b205f997e1c
Create Date: 2026-04-06 13:27:05.419525

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "64e6150a54a4"
down_revision: Union[str, Sequence[str], None] = "4b205f997e1c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    duplicates = bind.execute(
        sa.text(
            "SELECT name, owner_id, COUNT(*) "
            "FROM courses "
            "GROUP BY name, owner_id "
            "HAVING COUNT(*) > 1"
        )
    ).fetchall()
    if duplicates:
        pairs = ", ".join(f"(name={r[0]!r}, owner_id={r[1]})" for r in duplicates)
        raise RuntimeError(
            f"Cannot add uq_course_name_owner: duplicate course names exist "
            f"for the same owner — {pairs}"
        )
    with op.batch_alter_table("courses") as batch_op:
        batch_op.create_unique_constraint("uq_course_name_owner", ["name", "owner_id"])


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("courses") as batch_op:
        batch_op.drop_constraint("uq_course_name_owner", type_="unique")
