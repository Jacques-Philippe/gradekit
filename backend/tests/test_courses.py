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
