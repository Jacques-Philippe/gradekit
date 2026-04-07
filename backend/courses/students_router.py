import csv
import io
import json
import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.activity import Activity
from models.activity_type import ActivityType
from models.course import Course
from models.enrollment import Enrollment
from models.student import Student
from models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/courses/{course_id}/students")


class CreateStudentRequest(BaseModel):
    full_name: str

    @field_validator("full_name")
    @classmethod
    def full_name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Student name cannot be blank")
        return v


class StudentResponse(BaseModel):
    id: int
    full_name: str


class ImportRowError(BaseModel):
    row: int
    reason: str


class ImportResponse(BaseModel):
    created: list[StudentResponse]
    errors: list[ImportRowError]


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


@router.post("", response_model=StudentResponse, status_code=201)
def create_student(
    course_id: int,
    body: CreateStudentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = get_owned_course(course_id, current_user, db)
    student = Student(full_name=body.full_name)
    db.add(student)
    db.flush()
    db.add(Enrollment(course_id=course_id, student_id=student.id))
    db.commit()
    db.refresh(student)
    try:
        db.add(
            Activity(
                user_id=current_user.id,
                event_type=ActivityType.STUDENT_ADDED,
                payload=json.dumps(
                    {
                        "course_id": course_id,
                        "course_name": course.name,
                        "student_id": student.id,
                        "student_name": student.full_name,
                    }
                ),
            )
        )
        db.commit()
    except Exception:
        logger.exception("Failed to record STUDENT_ADDED activity")
    return StudentResponse(id=student.id, full_name=student.full_name)


@router.delete("/{student_id}", status_code=204)
def remove_student(
    course_id: int,
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = get_owned_course(course_id, current_user, db)
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == course_id, Enrollment.student_id == student_id)
        .first()
    )
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Student not found in course")
    student = db.get(Student, student_id)
    db.delete(enrollment)
    db.commit()
    try:
        student_name = student.full_name if student else None
        db.add(
            Activity(
                user_id=current_user.id,
                event_type=ActivityType.STUDENT_REMOVED,
                payload=json.dumps(
                    {
                        "course_id": course_id,
                        "course_name": course.name,
                        "student_id": student_id,
                        "student_name": student_name,
                    }
                ),
            )
        )
        db.commit()
    except Exception:
        logger.exception("Failed to record STUDENT_REMOVED activity")


@router.post("/import", response_model=ImportResponse)
def import_students(
    course_id: int,
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = get_owned_course(course_id, current_user, db)
    raw = file.file.read()
    try:
        content = raw.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content = raw.decode("latin-1")
        except UnicodeDecodeError:
            logger.exception("CSV upload has unsupported encoding")
            raise HTTPException(
                status_code=422,
                detail="CSV file encoding is not supported; please upload a UTF-8 or Latin-1 encoded file",
            )
    reader = csv.DictReader(io.StringIO(content))
    if "full_name" not in (reader.fieldnames or []):
        raise HTTPException(
            status_code=422, detail="CSV must have a 'full_name' column"
        )
    created = []
    errors = []
    for row_num, row in enumerate(reader, start=2):
        full_name = (row.get("full_name") or "").strip()
        if not full_name:
            errors.append(ImportRowError(row=row_num, reason="Name cannot be blank"))
            continue
        student = Student(full_name=full_name)
        db.add(student)
        db.flush()
        db.add(Enrollment(course_id=course_id, student_id=student.id))
        created.append(StudentResponse(id=student.id, full_name=student.full_name))
    db.commit()
    if created:
        try:
            db.add(
                Activity(
                    user_id=current_user.id,
                    event_type=ActivityType.STUDENTS_IMPORTED,
                    payload=json.dumps(
                        {
                            "course_id": course_id,
                            "course_name": course.name,
                            "students": [
                                {"student_id": s.id, "student_name": s.full_name}
                                for s in created
                            ],
                        }
                    ),
                )
            )
            db.commit()
        except Exception:
            logger.exception("Failed to record STUDENTS_IMPORTED activity")
    return ImportResponse(created=created, errors=errors)
