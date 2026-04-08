from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.exceptions import RequestValidationError  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402
from starlette.requests import Request  # noqa: E402

from activity.router import router as activity_router  # noqa: E402
from deadlines.router import router as deadlines_router  # noqa: E402
from auth.router import router as auth_router  # noqa: E402
from courses.router import router as courses_router  # noqa: E402
from courses.students_router import router as students_router  # noqa: E402
from errors import AppHTTPException, ErrorCode  # noqa: E402

_VALIDATION_MSG_TO_CODE: dict[str, str] = {
    "student name cannot be blank": ErrorCode.STUDENT_NAME_BLANK,
}

app = FastAPI()


@app.exception_handler(AppHTTPException)
async def app_http_exception_handler(request: Request, exc: AppHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "code": exc.code,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [
        {"loc": list(e["loc"]), "msg": e["msg"], "type": e["type"]}
        for e in exc.errors()
    ]
    first_msg = errors[0]["msg"] if errors else "Validation error"
    code = _VALIDATION_MSG_TO_CODE.get(first_msg.lower(), ErrorCode.VALIDATION_ERROR)
    return JSONResponse(
        status_code=422,
        content={
            "detail": errors,
            "code": code,
        },
    )


app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(students_router)
app.include_router(activity_router)
app.include_router(deadlines_router)


@app.get("/health")
def health():
    return {"status": "ok"}
