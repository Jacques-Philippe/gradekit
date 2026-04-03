from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402

from activity.router import router as activity_router  # noqa: E402
from auth.router import router as auth_router  # noqa: E402
from courses.router import router as courses_router  # noqa: E402
from courses.students_router import router as students_router  # noqa: E402

app = FastAPI()

app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(students_router)
app.include_router(activity_router)


@app.get("/health")
def health():
    return {"status": "ok"}
