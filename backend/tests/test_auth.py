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


def test_register_fails_if_username_taken(client):
    client.post("/auth/register", json={"username": "alice", "password": "secret"})
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "other"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "The username is already taken"
