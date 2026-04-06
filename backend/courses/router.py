import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.activity import Activity
from models.activity_type import ActivityType
from models.course import Course
from models.user import User

logger = logging.getLogger(__name__)

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
        name=body.name,
        description=body.description,
        owner_id=current_user.id,
    )
    db.add(course)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Course name already exists")
    db.refresh(course)
    try:
        db.add(
            Activity(
                user_id=current_user.id,
                event_type=ActivityType.COURSE_CREATED,
                payload=json.dumps(
                    {"course_id": course.id, "course_name": course.name}
                ),
            )
        )
        db.commit()
    except Exception:
        logger.exception("Failed to record COURSE_CREATED activity")
    return CourseResponse(
        id=course.id,
        name=course.name,
        description=course.description,
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
        id=course.id,
        name=course.name,
        description=course.description,
    )


@router.delete("/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.get(Course, course_id)
    if course is None or course.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
