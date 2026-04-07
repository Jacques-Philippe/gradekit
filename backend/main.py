from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402
from starlette.requests import Request  # noqa: E402

from activity.router import router as activity_router  # noqa: E402
from deadlines.router import router as deadlines_router  # noqa: E402
from auth.router import router as auth_router  # noqa: E402
from courses.router import router as courses_router  # noqa: E402
from courses.students_router import router as students_router  # noqa: E402
from errors import AppHTTPException  # noqa: E402

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


app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(students_router)
app.include_router(activity_router)
app.include_router(deadlines_router)


@app.get("/health")
def health():
    return {"status": "ok"}
