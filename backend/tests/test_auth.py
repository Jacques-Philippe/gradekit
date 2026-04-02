def test_register_succeeds_and_returns_token(client):
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "secret"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert isinstance(data["token"], str)
    assert len(data["token"]) > 0


def test_login_succeeds_and_returns_token(client):
    client.post("/auth/register", json={"username": "alice", "password": "secret"})
    response = client.post(
        "/auth/login", json={"username": "alice", "password": "secret"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert isinstance(data["token"], str)
    assert len(data["token"]) > 0


def test_login_fails_if_username_does_not_exist(client):
    response = client.post(
        "/auth/login", json={"username": "ghost", "password": "secret"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Username does not exist"


def test_login_fails_if_password_wrong(client):
    client.post("/auth/register", json={"username": "alice", "password": "secret"})
    response = client.post(
        "/auth/login", json={"username": "alice", "password": "wrong"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid password"


def test_me_returns_current_user(client):
    res = client.post(
        "/auth/register", json={"username": "alice", "password": "secret"}
    )
    token = res.json()["token"]
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "alice"
    assert "id" in data


def test_me_fails_without_token(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_me_fails_with_invalid_token(client):
    response = client.get("/auth/me", headers={"Authorization": "Bearer not.a.token"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"


def test_me_fails_with_expired_token(client):
    from datetime import timedelta

    from auth.security import create_access_token

    token = create_access_token(999, "ghost", expires_in=timedelta(seconds=-1))
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"


def test_register_fails_if_username_taken(client):
    client.post("/auth/register", json={"username": "alice", "password": "secret"})
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "other"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "The username is already taken"
