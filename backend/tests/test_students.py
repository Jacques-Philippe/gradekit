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


def test_create_student_succeeds(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.post(
        f"/courses/{course_id}/students",
        json={"full_name": "Jane Doe"},
        headers=auth(token),
    )
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Jane Doe"
    assert "id" in data


def test_create_student_appears_in_list(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    client.post(
        f"/courses/{course_id}/students",
        json={"full_name": "Jane Doe"},
        headers=auth(token),
    )
    response = client.get(f"/courses/{course_id}/students", headers=auth(token))
    assert len(response.json()) == 1
    assert response.json()[0]["full_name"] == "Jane Doe"


def test_create_student_rejects_blank_name(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.post(
        f"/courses/{course_id}/students",
        json={"full_name": "   "},
        headers=auth(token),
    )
    assert response.status_code == 422
    messages = [e["msg"] for e in response.json()["detail"]]
    assert any("Student name cannot be blank" in msg for msg in messages)


def test_create_student_returns_404_for_nonexistent_course(client):
    token = register_and_login(client)
    response = client.post(
        "/courses/999/students",
        json={"full_name": "Jane Doe"},
        headers=auth(token),
    )
    assert response.status_code == 404


def test_create_student_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    course_id = create_course(client, token_alice)
    response = client.post(
        f"/courses/{course_id}/students",
        json={"full_name": "Jane Doe"},
        headers=auth(token_bob),
    )
    assert response.status_code == 404


def test_create_student_requires_authentication(client):
    response = client.post("/courses/1/students", json={"full_name": "Jane Doe"})
    assert response.status_code == 401


def add_student(client, token, course_id, full_name="Jane Doe"):
    res = client.post(
        f"/courses/{course_id}/students",
        json={"full_name": full_name},
        headers=auth(token),
    )
    return res.json()["id"]


def test_remove_student_succeeds(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    student_id = add_student(client, token, course_id)
    response = client.delete(
        f"/courses/{course_id}/students/{student_id}", headers=auth(token)
    )
    assert response.status_code == 204
    listed = client.get(f"/courses/{course_id}/students", headers=auth(token))
    assert listed.json() == []


def test_remove_student_returns_404_for_nonexistent_student(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.delete(f"/courses/{course_id}/students/999", headers=auth(token))
    assert response.status_code == 404


def test_remove_student_returns_404_for_nonexistent_course(client):
    token = register_and_login(client)
    response = client.delete("/courses/999/students/1", headers=auth(token))
    assert response.status_code == 404


def test_remove_student_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    course_id = create_course(client, token_alice)
    student_id = add_student(client, token_alice, course_id)
    response = client.delete(
        f"/courses/{course_id}/students/{student_id}", headers=auth(token_bob)
    )
    assert response.status_code == 404


def test_remove_student_requires_authentication(client):
    response = client.delete("/courses/1/students/1")
    assert response.status_code == 401


def csv_file(content: str):
    return {"file": ("students.csv", content.encode(), "text/csv")}


def test_import_students_succeeds(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.post(
        f"/courses/{course_id}/students/import",
        files=csv_file("full_name\nJane Doe\nJohn Smith\n"),
        headers=auth(token),
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["created"]) == 2
    assert data["errors"] == []
    names = [s["full_name"] for s in data["created"]]
    assert names == ["Jane Doe", "John Smith"]


def test_import_students_appear_in_list(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    client.post(
        f"/courses/{course_id}/students/import",
        files=csv_file("full_name\nJane Doe\nJohn Smith\n"),
        headers=auth(token),
    )
    response = client.get(f"/courses/{course_id}/students", headers=auth(token))
    assert len(response.json()) == 2


def test_import_students_partial_errors(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.post(
        f"/courses/{course_id}/students/import",
        files=csv_file("full_name\nJane Doe\n   \nJohn Smith\n"),
        headers=auth(token),
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["created"]) == 2
    assert len(data["errors"]) == 1
    assert data["errors"][0]["row"] == 3
    assert "blank" in data["errors"][0]["reason"].lower()


def test_import_students_missing_column_returns_422(client):
    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.post(
        f"/courses/{course_id}/students/import",
        files=csv_file("name\nJane Doe\n"),
        headers=auth(token),
    )
    assert response.status_code == 422


def test_import_students_returns_404_for_nonexistent_course(client):
    token = register_and_login(client)
    response = client.post(
        "/courses/999/students/import",
        files=csv_file("full_name\nJane Doe\n"),
        headers=auth(token),
    )
    assert response.status_code == 404


def test_import_students_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    course_id = create_course(client, token_alice)
    response = client.post(
        f"/courses/{course_id}/students/import",
        files=csv_file("full_name\nJane Doe\n"),
        headers=auth(token_bob),
    )
    assert response.status_code == 404


def test_import_students_records_activity(client, db_session):
    import json
    from models.activity import Activity
    from models.activity_type import ActivityType

    token = register_and_login(client)
    course_id = create_course(client, token)
    client.post(
        f"/courses/{course_id}/students/import",
        files=csv_file("full_name\nJane Doe\nJohn Smith\n"),
        headers=auth(token),
    )

    events = (
        db_session.query(Activity)
        .filter(Activity.event_type == ActivityType.STUDENTS_IMPORTED)
        .all()
    )
    assert len(events) == 1
    payload = json.loads(events[0].payload)
    assert payload["course_id"] == course_id
    assert payload["course_name"] == "CS101"
    assert len(payload["students"]) == 2
    names = [s["student_name"] for s in payload["students"]]
    assert "Jane Doe" in names
    assert "John Smith" in names


def test_import_students_requires_authentication(client):
    response = client.post(
        "/courses/1/students/import",
        files=csv_file("full_name\nJane Doe\n"),
    )
    assert response.status_code == 401


def test_add_student_records_activity(client, db_session):
    import json
    from models.activity import Activity
    from models.activity_type import ActivityType

    token = register_and_login(client)
    course_id = create_course(client, token)
    response = client.post(
        f"/courses/{course_id}/students",
        json={"full_name": "Jane Doe"},
        headers=auth(token),
    )
    student_id = response.json()["id"]

    events = (
        db_session.query(Activity)
        .filter(Activity.event_type == ActivityType.STUDENT_ADDED)
        .all()
    )
    assert len(events) == 1
    payload = json.loads(events[0].payload)
    assert payload["course_id"] == course_id
    assert payload["course_name"] == "CS101"
    assert payload["student_id"] == student_id
    assert payload["student_name"] == "Jane Doe"
