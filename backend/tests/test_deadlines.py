from datetime import datetime, timedelta, timezone

from models.assignment import Assignment
from models.course import Course


def register_and_login(client, username="alice", password="secret"):
    client.post("/auth/register", json={"username": username, "password": password})
    res = client.post("/auth/login", json={"username": username, "password": password})
    return res.json()["token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def seed_assignment(db_session, title, course_id, due_date=None):
    a = Assignment(title=title, course_id=course_id, due_date=due_date)
    db_session.add(a)
    db_session.commit()
    db_session.refresh(a)
    return a


def seed_course(db_session, name, owner_id):
    c = Course(name=name, owner_id=owner_id)
    db_session.add(c)
    db_session.commit()
    db_session.refresh(c)
    return c


def get_user_id(db_session, username):
    import sqlalchemy

    return db_session.execute(
        sqlalchemy.text("SELECT id FROM users WHERE username = :u"),
        {"u": username},
    ).scalar()


def future(days=1):
    return datetime.now(timezone.utc) + timedelta(days=days)


def past(days=1):
    return datetime.now(timezone.utc) - timedelta(days=days)


def test_deadlines_returns_assignments_ordered_by_due_date(client, db_session):
    token = register_and_login(client)
    user_id = get_user_id(db_session, "alice")
    course = seed_course(db_session, "CS101", user_id)
    seed_assignment(db_session, "Later", course.id, future(days=3))
    seed_assignment(db_session, "Sooner", course.id, future(days=1))
    seed_assignment(db_session, "Middle", course.id, future(days=2))

    response = client.get("/deadlines", headers=auth(token))
    assert response.status_code == 200
    titles = [a["assignment_title"] for a in response.json()]
    assert titles == ["Sooner", "Middle", "Later"]


def test_deadlines_excludes_assignments_with_no_due_date(client, db_session):
    token = register_and_login(client)
    user_id = get_user_id(db_session, "alice")
    course = seed_course(db_session, "CS101", user_id)
    seed_assignment(db_session, "No date", course.id, due_date=None)
    seed_assignment(db_session, "Has date", course.id, future(days=1))

    response = client.get("/deadlines", headers=auth(token))
    titles = [a["assignment_title"] for a in response.json()]
    assert titles == ["Has date"]


def test_deadlines_excludes_past_due_dates(client, db_session):
    token = register_and_login(client)
    user_id = get_user_id(db_session, "alice")
    course = seed_course(db_session, "CS101", user_id)
    seed_assignment(db_session, "Past", course.id, past(days=1))
    seed_assignment(db_session, "Future", course.id, future(days=1))

    response = client.get("/deadlines", headers=auth(token))
    titles = [a["assignment_title"] for a in response.json()]
    assert titles == ["Future"]


def test_deadlines_only_returns_own_courses(client, db_session):
    token_alice = register_and_login(client, "alice", "secret")
    register_and_login(client, "bob", "secret")
    alice_id = get_user_id(db_session, "alice")
    bob_id = get_user_id(db_session, "bob")
    course_alice = seed_course(db_session, "Alice Course", alice_id)
    course_bob = seed_course(db_session, "Bob Course", bob_id)
    seed_assignment(db_session, "Alice HW", course_alice.id, future(days=1))
    seed_assignment(db_session, "Bob HW", course_bob.id, future(days=1))

    response = client.get("/deadlines", headers=auth(token_alice))
    titles = [a["assignment_title"] for a in response.json()]
    assert titles == ["Alice HW"]


def test_deadlines_returns_empty_list_when_none(client):
    token = register_and_login(client)
    response = client.get("/deadlines", headers=auth(token))
    assert response.status_code == 200
    assert response.json() == []


def test_deadlines_requires_authentication(client):
    response = client.get("/deadlines")
    assert response.status_code == 401
