from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.course import Course
from models.user import User

router = APIRouter(prefix="/courses")


class CreateCourseRequest(BaseModel):
    name: str
    description: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Course name cannot be blank")
        if len(v.strip()) > 255:
            raise ValueError("Course name cannot exceed 255 characters")
        return v.strip()


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


@router.post("", response_model=CourseResponse, status_code=201)
def create_course(
    body: CreateCourseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = Course(
        name=body.name, description=body.description, owner_id=current_user.id
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return CourseResponse(
        id=course.id, name=course.name, description=course.description
    )


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.get(Course, course_id)
    if course is None or course.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseResponse(
        id=course.id, name=course.name, description=course.description
    )
