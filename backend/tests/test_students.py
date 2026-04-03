from models.enrollment import Enrollment
from models.student import Student


def register_and_login(client, username="alice", password="secret"):
    client.post("/auth/register", json={"username": username, "password": password})
    res = client.post("/auth/login", json={"username": username, "password": password})
    return res.json()["token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def create_course(client, token, name="CS101"):
    res = client.post("/courses", json={"name": name}, headers=auth(token))
    return res.json()["id"]


def test_list_students_returns_empty_when_no_enrollments(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.get(f"/courses/{course_id}/students", headers=auth(token))
    assert response.status_code == 200
    assert response.json() == []


def test_list_students_returns_enrolled_students(client, db_session):
    token = register_and_login(client)
    course_id = create_course(client, token)

    student = Student(full_name="Jane Doe")
    db_session.add(student)
    db_session.flush()
    db_session.add(Enrollment(course_id=course_id, student_id=student.id))
    db_session.commit()

    response = client.get(f"/courses/{course_id}/students", headers=auth(token))
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["full_name"] == "Jane Doe"


def test_list_students_returns_404_for_nonexistent_course(client):
    token = register_and_login(client)
    response = client.get("/courses/999/students", headers=auth(token))
    assert response.status_code == 404


def test_list_students_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    course_id = create_course(client, token_alice)
    response = client.get(f"/courses/{course_id}/students", headers=auth(token_bob))
    assert response.status_code == 404


def test_list_students_requires_authentication(client):
    response = client.get("/courses/1/students")
    assert response.status_code == 401
