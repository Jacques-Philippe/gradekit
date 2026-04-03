import json
from datetime import datetime, timezone

from models.activity import Activity
from models.activity_type import ActivityType


def register_and_login(client, username="alice", password="secret"):
    client.post("/auth/register", json={"username": username, "password": password})
    res = client.post("/auth/login", json={"username": username, "password": password})
    return res.json()["token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def create_course(client, token, name="CS101"):
    res = client.post("/courses", json={"name": name}, headers=auth(token))
    return res.json()["id"]


def seed_activity(db_session, user_id, event_type, payload, created_at=None):
    db_session.add(
        Activity(
            user_id=user_id,
            event_type=event_type,
            payload=json.dumps(payload),
            created_at=created_at or datetime.now(timezone.utc),
        )
    )
    db_session.commit()


def test_get_activity_returns_events_most_recent_first(client, db_session):
    token = register_and_login(client)
    course_id = create_course(client, token)

    # Create course records one event; create two more students for more events
    client.post(
        f"/courses/{course_id}/students", json={"full_name": "A"}, headers=auth(token)
    )
    client.post(
        f"/courses/{course_id}/students", json={"full_name": "B"}, headers=auth(token)
    )

    response = client.get("/activity", headers=auth(token))
    assert response.status_code == 200
    events = response.json()
    assert len(events) == 3
    # Most recent first — created_at should be descending
    timestamps = [e["created_at"] for e in events]
    assert timestamps == sorted(timestamps, reverse=True)


def test_get_activity_only_returns_own_events(client, db_session):
    token_alice = register_and_login(client, "alice", "secret")
    token_bob = register_and_login(client, "bob", "secret")
    create_course(client, token_alice, "Alice Course")
    create_course(client, token_bob, "Bob Course")

    response = client.get("/activity", headers=auth(token_alice))
    events = response.json()
    assert len(events) == 1
    payload = json.loads(events[0]["payload"])
    assert payload["course_name"] == "Alice Course"


def test_get_activity_returns_at_most_20_events(client, db_session):
    token = register_and_login(client)
    # Seed 25 events directly
    user_id = db_session.execute(
        __import__("sqlalchemy").text("SELECT id FROM users WHERE username = 'alice'")
    ).scalar()
    for i in range(25):
        seed_activity(
            db_session,
            user_id,
            ActivityType.COURSE_CREATED,
            {"course_id": i, "course_name": f"C{i}"},
        )

    response = client.get("/activity", headers=auth(token))
    assert response.status_code == 200
    assert len(response.json()) == 20


def test_get_activity_filters_by_event_type(client, db_session):
    token = register_and_login(client)
    course_id = create_course(client, token)
    client.post(
        f"/courses/{course_id}/students",
        json={"full_name": "Jane"},
        headers=auth(token),
    )

    response = client.get("/activity?event_type=STUDENT_ADDED", headers=auth(token))
    assert response.status_code == 200
    events = response.json()
    assert len(events) == 1
    assert events[0]["event_type"] == "STUDENT_ADDED"


def test_get_activity_requires_authentication(client):
    response = client.get("/activity")
    assert response.status_code == 401


def test_get_activity_returns_empty_list_when_no_events(client):
    token = register_and_login(client)
    response = client.get("/activity", headers=auth(token))
    assert response.status_code == 200
    assert response.json() == []
