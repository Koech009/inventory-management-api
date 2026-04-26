import pytest
from app import create_app, db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.supplier import Supplier

from app.models.stock_transaction import StockTransaction, MovementType


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
    client.post("/api/auth/register", json={
        "username": "tester",
        "email": "tester@example.com",
        "password": "password123",
        "role": "admin"
    })
    resp = client.post("/api/auth/login", json={
        "username": "tester",
        "password": "password123"
    })
    token = resp.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_and_login(client):
    resp = client.post("/api/auth/register", json={
        "username": "tester",
        "email": "tester@example.com",
        "password": "password123",
        "role": "admin"
    })
    assert resp.status_code == 201

    resp = client.post("/api/auth/login", json={
        "username": "tester",
        "password": "password123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert "token" in data


def test_user_routes(client, auth_token):
    resp = client.post("/api/auth/register", json={
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123",
        "role": "staff"
    })
    assert resp.status_code == 201
    user_id = resp.get_json()["id"]

    resp = client.get("/api/users", headers=auth_token)
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

    resp = client.get(f"/api/users/{user_id}", headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["username"] == "newuser"

    resp = client.put(f"/api/users/{user_id}",
                      json={"role": "manager"}, headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["role"] == "manager"

    resp = client.delete(f"/api/users/{user_id}", headers=auth_token)
    assert resp.status_code == 204


def test_category_routes(client, auth_token):
    resp = client.post("/api/categories", json={
        "name": "Electronics",
        "description": "Electronic items"
    }, headers=auth_token)
    assert resp.status_code == 201
    cat_id = resp.get_json()["id"]

    resp = client.get("/api/categories", headers=auth_token)
    assert resp.status_code == 200
    assert "categories" in resp.get_json()

    resp = client.get(f"/api/categories/{cat_id}", headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Electronics"

    resp = client.put(f"/api/categories/{cat_id}", json={
        "name": "Electronics",
        "description": "All gadgets and devices"
    }, headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["description"] == "All gadgets and devices"

    resp = client.delete(f"/api/categories/{cat_id}", headers=auth_token)
    assert resp.status_code == 204


def test_supplier_routes(client, auth_token):
    resp = client.post("/api/suppliers", json={
        "name": "Acme Corp",
        "contact_email": "acme@example.com",
        "phone": "0712345678",
        "address": "Nairobi, Kenya"
    }, headers=auth_token)
    assert resp.status_code == 201
    sup_id = resp.get_json()["id"]

    resp = client.get("/api/suppliers", headers=auth_token)
    assert resp.status_code == 200
    assert "suppliers" in resp.get_json()

    resp = client.get(f"/api/suppliers/{sup_id}", headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Acme Corp"

    resp = client.put(f"/api/suppliers/{sup_id}", json={
        "name": "Acme Corp",
        "contact_email": "acme@example.com",
        "phone": "0799999999",
        "address": "Mombasa, Kenya"
    }, headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["address"] == "Mombasa, Kenya"

    resp = client.delete(f"/api/suppliers/{sup_id}", headers=auth_token)
    assert resp.status_code == 204


def test_product_routes(client, auth_token):
    cat = client.post("/api/categories", json={
        "name": "Electronics",
        "description": "Gadgets"
    }, headers=auth_token).get_json()

    sup = client.post("/api/suppliers", json={
        "name": "Acme",
        "contact_email": "acme@example.com"
    }, headers=auth_token).get_json()

    resp = client.post("/api/products", json={
        "name": "Phone",
        "description": "A smartphone",
        "price": 999.99,
        "quantity": 10,
        "category_id": cat["id"],
        "supplier_id": sup["id"]
    }, headers=auth_token)
    assert resp.status_code == 201
    prod_id = resp.get_json()["id"]

    resp = client.get("/api/products", headers=auth_token)
    assert resp.status_code == 200
    assert "products" in resp.get_json()

    resp = client.get(f"/api/products/{prod_id}", headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Phone"

    resp = client.put(f"/api/products/{prod_id}", json={
        "name": "Phone Pro",
        "description": "An upgraded smartphone",
        "price": 1199.99,
        "quantity": 8,
        "category_id": cat["id"],
        "supplier_id": sup["id"]
    }, headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["name"] == "Phone Pro"
    assert resp.get_json()["price"] == 1199.99

    resp = client.delete(f"/api/products/{prod_id}", headers=auth_token)
    assert resp.status_code == 204


def test_inventory_routes(client, auth_token):
    cat = client.post("/api/categories", json={
        "name": "Electronics",
        "description": "Gadgets"
    }, headers=auth_token).get_json()

    sup = client.post("/api/suppliers", json={
        "name": "Acme",
        "contact_email": "acme@example.com"
    }, headers=auth_token).get_json()

    prod = client.post("/api/products", json={
        "name": "Laptop",
        "description": "A laptop",
        "price": 1200,
        "quantity": 5,
        "category_id": cat["id"],
        "supplier_id": sup["id"]
    }, headers=auth_token).get_json()

    resp = client.post("/api/inventory", json={
        "product_id": prod["id"],
        "movement_type": "in",
        "quantity": 3
    }, headers=auth_token)
    assert resp.status_code == 201
    txn_id = resp.get_json()["id"]

    assert resp.get_json()["movement_type"] == "in"
    assert resp.get_json()["quantity"] == 3

    resp = client.get("/api/inventory", headers=auth_token)
    assert resp.status_code == 200
    assert "transactions" in resp.get_json()

    resp = client.get(f"/api/inventory/{txn_id}", headers=auth_token)
    assert resp.status_code == 200
    assert resp.get_json()["id"] == txn_id

    resp = client.delete(f"/api/inventory/{txn_id}", headers=auth_token)
    assert resp.status_code == 204


def test_stock_transaction_relationship(app):
    with app.app_context():
        u = User(username="staff", email="s@example.com")
        u.password = "pw"
        p = Product(name="Item", price=5, quantity=1)
        t = StockTransaction(
            product=p,
            user=u,
            movement_type=MovementType("in"),  # ✅ imported and used correctly
            quantity=3,
            stock_level=4,
        )
        assert t.quantity == 3
        assert t.movement_type.value == "in"
