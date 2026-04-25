def test_register_user(client):
    resp = client.post("/api/auth/register", json={
        "username": "tester",
        "email": "tester@example.com",
        "password": "password123",
        "role": "staff"
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["username"] == "tester"
    assert data["email"] == "tester@example.com"


def test_login_user(client):
    client.post("/api/auth/register", json={
        "username": "tester",
        "email": "tester@example.com",
        "password": "password123",
        "role": "staff"
    })

    resp = client.post("/api/auth/login", json={
        "username": "tester",
        "password": "password123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert "token" in data
    assert "user" in data


def test_protected_me_route(client, auth_token):
    resp = client.get("/api/auth/me", headers=auth_token)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["username"] == "tester"
    assert data["email"] == "tester@example.com"


def test_logout(client, auth_token):
    resp = client.post("/api/auth/logout", headers=auth_token)
    assert resp.status_code == 200
    data = resp.get_json()
    assert "message" in data
