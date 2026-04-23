import pytest
from flask import Flask
from models import db as _db
from models.user import User
from models.category import Category
from models.supplier import Supplier
from models.product import Product
from models.stock_transaction import StockTransaction


@pytest.fixture(scope="session")
def app():
    """Create a Flask app configured for testing with an in-memory SQLite DB."""
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    _db.init_app(app)

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture
def db(app):
    """
    Wrap each test in a transaction that is rolled back after the test runs.
    This keeps tests isolated without recreating the schema each time.
    """
    with app.app_context():
        connection = _db.engine.connect()
        transaction = connection.begin()

        # Bind the session to this connection so rollback covers everything
        _db.session.bind = connection

        yield _db

        _db.session.remove()
        transaction.rollback()
        connection.close()


# ── Reusable object factories ──────────────────────────────────────────────────

def make_category(db, name="Electronics"):
    cat = Category(name=name)
    db.session.add(cat)
    db.session.flush()  # get cat.id without a full commit
    return cat


def make_supplier(db, name="Acme Ltd"):
    sup = Supplier(name=name, contact_info="acme@example.com")
    db.session.add(sup)
    db.session.flush()
    return sup


def make_user(db, username="alice", role="staff"):
    user = User(username=username, password_hash="hashed_pw", role=role)
    db.session.add(user)
    db.session.flush()
    return user


def make_product(db, category_id, supplier_id=None, name="Laptop", price=999.99, qty=10):
    product = Product(
        name=name,
        price=price,
        stock_quantity=qty,
        category_id=category_id,
        supplier_id=supplier_id,
    )
    db.session.add(product)
    db.session.flush()
    return product