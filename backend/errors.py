"""Error codes for API responses."""

from enum import Enum

from fastapi import HTTPException


class ErrorCode(str, Enum):
    """Standard error codes for the API."""

    USERNAME_TAKEN = "ERR_USERNAME_TAKEN"
    INVALID_CREDENTIALS = "ERR_INVALID_CREDENTIALS"
    COURSE_NOT_FOUND = "ERR_COURSE_NOT_FOUND"
    COURSE_NAME_TAKEN = "ERR_COURSE_NAME_TAKEN"
    STUDENT_NOT_FOUND = "ERR_STUDENT_NOT_FOUND"
    UNSUPPORTED_FILE_ENCODING = "ERR_UNSUPPORTED_FILE_ENCODING"
    CSV_MISSING_COLUMN = "ERR_CSV_MISSING_COLUMN"
    STUDENT_NAME_BLANK = "ERR_STUDENT_NAME_BLANK"
    VALIDATION_ERROR = "ERR_VALIDATION_ERROR"


class AppHTTPException(HTTPException):
    """HTTPException with error code."""

    def __init__(
        self,
        status_code: int,
        detail: str,
        code: ErrorCode,
    ) -> None:
        super().__init__(status_code=status_code, detail=detail)
        self.code = code
