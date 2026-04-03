from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.course import Course
from models.user import User

router = APIRouter(prefix="/courses")


class CourseResponse(BaseModel):
    id: int
    name: str
    description: str | None


@router.get("", response_model=list[CourseResponse])
def list_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    courses = db.query(Course).filter(Course.owner_id == current_user.id).all()
    return [
        CourseResponse(id=c.id, name=c.name, description=c.description) for c in courses
    ]
