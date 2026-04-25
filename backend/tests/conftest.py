import pytest
from app import create_app, db


@pytest.fixture(scope="session")
def app():
    app = create_app(testing=True)
    return app


@pytest.fixture(scope="function")
def client(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        with app.test_client() as client:
            yield client
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope="function")
def auth_token(client):
    # Register
    client.post("/api/auth/register", json={
        "username": "tester",
        "email": "tester@example.com",
        "password": "password123",
        "role": "admin"
    })

    # Login
    resp = client.post("/api/auth/login", json={
        "username": "tester",
        "password": "password123"
    })

    token = resp.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}
