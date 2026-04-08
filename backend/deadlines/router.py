from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.assignment import Assignment
from models.course import Course
from models.user import User

router = APIRouter(prefix="/deadlines")


class DeadlineResponse(BaseModel):
    assignment_id: int
    assignment_title: str
    course_id: int
    course_name: str
    due_date: datetime


@router.get("", response_model=list[DeadlineResponse])
def list_deadlines(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    rows = (
        db.query(Assignment, Course)
        .join(Course, Course.id == Assignment.course_id)
        .filter(
            Course.owner_id == current_user.id,
            Assignment.due_date.isnot(None),
            Assignment.due_date >= now,
        )
        .order_by(Assignment.due_date.asc())
        .all()
    )
    return [
        DeadlineResponse(
            assignment_id=a.id,
            assignment_title=a.title,
            course_id=c.id,
            course_name=c.name,
            due_date=a.due_date,
        )
        for a, c in rows
    ]
