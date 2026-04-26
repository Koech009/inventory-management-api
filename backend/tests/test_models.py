import pytest
from app.extensions import db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.stock_transaction import StockTransaction, MovementType


def test_user_password_hash(app):
    with app.app_context():
        u = User(username="tester", email="t@example.com")
        u.password = "secret"
        assert u.check_password("secret")
        assert not u.check_password("wrong")


def test_category_product_relationship(app):
    with app.app_context():
        c = Category(name="Electronics")
        p = Product(name="Phone", price=1000, quantity=5, category=c)
        assert p.category == c
        assert c.products[0] == p


def test_supplier_product_relationship(app):
    with app.app_context():
        s = Supplier(name="Acme", contact_email="acme@example.com")
        p = Product(name="Widget", price=10, quantity=2, supplier=s)
        assert p.supplier == s
        assert s.products[0] == p


def test_product_creator_relationship(app):
    with app.app_context():
        u = User(username="creator", email="creator@example.com")
        u.password = "pw"
        p = Product(name="Item", price=5, quantity=1, creator=u)
        assert p.creator == u


def test_stock_transaction_relationship(app):
    with app.app_context():
        u = User(username="staff", email="s@example.com")
        u.password = "pw"
        p = Product(name="Item", price=5, quantity=1)
        t = StockTransaction(
            product=p,
            user=u,
            movement_type=MovementType("in"),
            quantity=3,

            stock_level=4,
        )
        assert t.product == p
        assert t.user == u
        assert t.movement_type == MovementType("in")
        assert t.quantity == 3
        assert t.stock_level == 4
