def test_register_succeeds_and_returns_token(client):
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "secret"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert isinstance(data["token"], str)
    assert len(data["token"]) > 0
