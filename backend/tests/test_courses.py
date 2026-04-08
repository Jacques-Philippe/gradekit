def register_and_login(client, username="alice", password="secret"):
    client.post("/auth/register", json={"username": username, "password": password})
    res = client.post("/auth/login", json={"username": username, "password": password})
    return res.json()["token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_list_courses_returns_empty_list_when_no_courses(client):
    token = register_and_login(client)
    response = client.get("/courses", headers=auth(token))
    assert response.status_code == 200
    assert response.json() == []


def test_list_courses_requires_authentication(client):
    response = client.get("/courses")
    assert response.status_code == 401


def test_create_course_succeeds(client):
    token = register_and_login(client)
    response = client.post(
        "/courses",
        json={"name": "Math 101", "description": "Intro to math"},
        headers=auth(token),
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Math 101"
    assert data["description"] == "Intro to math"
    assert "id" in data


def test_create_course_without_description(client):
    token = register_and_login(client)
    response = client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    assert response.status_code == 201
    assert response.json()["description"] is None


def test_create_course_appears_in_list(client):
    token = register_and_login(client)
    client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    response = client.get("/courses", headers=auth(token))
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Math 101"


def test_create_course_requires_authentication(client):
    response = client.post("/courses", json={"name": "Math 101"})
    assert response.status_code == 401


def test_create_course_rejects_blank_name(client):
    token = register_and_login(client)
    response = client.post("/courses", json={"name": "   "}, headers=auth(token))
    assert response.status_code == 422
    messages = [e["msg"] for e in response.json()["detail"]]
    assert any("Course name cannot be blank" in msg for msg in messages)


def test_create_course_rejects_duplicate_name_for_same_user(client):
    token = register_and_login(client)
    client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    response = client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    assert response.status_code == 409
    assert response.json()["detail"] == "Course name already exists"


def test_create_course_allows_same_name_for_different_users(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    r1 = client.post("/courses", json={"name": "Math 101"}, headers=auth(token_alice))
    r2 = client.post("/courses", json={"name": "Math 101"}, headers=auth(token_bob))
    assert r1.status_code == 201
    assert r2.status_code == 201


def test_get_course_succeeds(client):
    token = register_and_login(client)
    created = client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    course_id = created.json()["id"]
    response = client.get(f"/courses/{course_id}", headers=auth(token))
    assert response.status_code == 200
    assert response.json()["name"] == "Math 101"


def test_get_course_returns_404_for_nonexistent(client):
    token = register_and_login(client)
    response = client.get("/courses/999", headers=auth(token))
    assert response.status_code == 404


def test_get_course_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    created = client.post(
        "/courses", json={"name": "Alice's Course"}, headers=auth(token_alice)
    )
    course_id = created.json()["id"]
    response = client.get(f"/courses/{course_id}", headers=auth(token_bob))
    assert response.status_code == 404


def test_get_course_requires_authentication(client):
    response = client.get("/courses/1")
    assert response.status_code == 401


def test_update_course_succeeds(client):
    token = register_and_login(client)
    created = client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    course_id = created.json()["id"]
    response = client.patch(
        f"/courses/{course_id}",
        json={"name": "Math 202", "description": "Updated desc"},
        headers=auth(token),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Math 202"
    assert data["description"] == "Updated desc"


def test_update_course_partial_name_only(client):
    token = register_and_login(client)
    created = client.post(
        "/courses",
        json={"name": "Math 101", "description": "Original"},
        headers=auth(token),
    )
    course_id = created.json()["id"]
    response = client.patch(
        f"/courses/{course_id}", json={"name": "Math 202"}, headers=auth(token)
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Math 202"
    assert response.json()["description"] == "Original"


def test_update_course_rejects_duplicate_name(client):
    token = register_and_login(client)
    client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    created = client.post("/courses", json={"name": "Physics 101"}, headers=auth(token))
    course_id = created.json()["id"]
    response = client.patch(
        f"/courses/{course_id}", json={"name": "Math 101"}, headers=auth(token)
    )
    assert response.status_code == 409


def test_update_course_returns_404_for_nonexistent(client):
    token = register_and_login(client)
    response = client.patch("/courses/999", json={"name": "X"}, headers=auth(token))
    assert response.status_code == 404


def test_update_course_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    created = client.post(
        "/courses", json={"name": "Alice's Course"}, headers=auth(token_alice)
    )
    course_id = created.json()["id"]
    response = client.patch(
        f"/courses/{course_id}", json={"name": "Stolen"}, headers=auth(token_bob)
    )
    assert response.status_code == 404


def test_update_course_requires_authentication(client):
    response = client.patch("/courses/1", json={"name": "X"})
    assert response.status_code == 401


def test_delete_course_succeeds(client):
    token = register_and_login(client)
    created = client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    course_id = created.json()["id"]
    response = client.delete(f"/courses/{course_id}", headers=auth(token))
    assert response.status_code == 204
    assert client.get(f"/courses/{course_id}", headers=auth(token)).status_code == 404


def test_delete_course_returns_404_for_nonexistent(client):
    token = register_and_login(client)
    response = client.delete("/courses/999", headers=auth(token))
    assert response.status_code == 404


def test_delete_course_returns_404_for_other_users_course(client):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    created = client.post(
        "/courses", json={"name": "Alice's Course"}, headers=auth(token_alice)
    )
    course_id = created.json()["id"]
    response = client.delete(f"/courses/{course_id}", headers=auth(token_bob))
    assert response.status_code == 404


def test_delete_course_requires_authentication(client):
    response = client.delete("/courses/1")
    assert response.status_code == 401


def test_create_course_records_activity(client, db_session):
    import json
    from models.activity import Activity
    from models.activity_type import ActivityType

    token = register_and_login(client)
    response = client.post("/courses", json={"name": "Math 101"}, headers=auth(token))
    course_id = response.json()["id"]

    events = (
        db_session.query(Activity)
        .filter(Activity.event_type == ActivityType.COURSE_CREATED)
        .all()
    )
    assert len(events) == 1
    payload = json.loads(events[0].payload)
    assert payload["course_id"] == course_id
    assert payload["course_name"] == "Math 101"


def test_list_courses_only_returns_own_courses(client, db_session):
    from models.course import Course

    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")

    db_session.add(Course(name="Alice's Course", owner_id=1))
    db_session.add(Course(name="Bob's Course", owner_id=2))
    db_session.commit()

    response = client.get("/courses", headers=auth(token_alice))
    assert response.status_code == 200
    names = [c["name"] for c in response.json()]
    assert names == ["Alice's Course"]

    response = client.get("/courses", headers=auth(token_bob))
    names = [c["name"] for c in response.json()]
    assert names == ["Bob's Course"]
