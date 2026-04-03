from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.course import Course
from models.enrollment import Enrollment
from models.student import Student
from models.user import User

router = APIRouter(prefix="/courses/{course_id}/students")


class StudentResponse(BaseModel):
    id: int
    full_name: str


def get_owned_course(course_id: int, current_user: User, db: Session) -> Course:
    course = db.get(Course, course_id)
    if course is None or course.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("", response_model=list[StudentResponse])
def list_students(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    get_owned_course(course_id, current_user, db)
    students = (
        db.query(Student)
        .join(Enrollment, Enrollment.student_id == Student.id)
        .filter(Enrollment.course_id == course_id)
        .all()
    )
    return [StudentResponse(id=s.id, full_name=s.full_name) for s in students]
