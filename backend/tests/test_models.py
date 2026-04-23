"""
Tests for all SQLAlchemy models.
Each class groups tests for one model: creation, constraints, and relationships.
Run with: pytest tests/test_models.py -v
"""
import pytest
from models.user import User
from models.category import Category
from models.supplier import Supplier
from models.product import Product
from models.stock_transaction import StockTransaction
from tests.conftest import make_category, make_supplier, make_user, make_product
 
 
# ── User ──────────────────────────────────────────────────────────────────────
 
class TestUserModel:
 
    def test_creates_user_with_valid_data(self, db):
        user = make_user(db, username="alice", role="admin")
        assert user.id is not None
        assert user.username == "alice"
        assert user.role == "admin"
 
    def test_default_role_is_staff(self, db):
        user = User(username="bob", password_hash="hashed")
        db.session.add(user)
        db.session.flush()
        assert user.role == "staff"
 
    def test_rejects_invalid_role(self, db):
        with pytest.raises(ValueError, match="Role must be one of"):
            User(username="charlie", password_hash="hashed", role="superuser")
 
    def test_username_must_be_unique(self, db):
        make_user(db, username="diana")
        duplicate = User(username="diana", password_hash="hashed")
        db.session.add(duplicate)
        with pytest.raises(Exception):  # IntegrityError on flush/commit
            db.session.flush()
 
    def test_valid_roles_accepted(self, db):
        for role in ("admin", "manager", "staff"):
            user = User(username=f"user_{role}", password_hash="hashed", role=role)
            db.session.add(user)
            db.session.flush()
            assert user.role == role
 
 
# ── Category ──────────────────────────────────────────────────────────────────
 
class TestCategoryModel:
 
    def test_creates_category(self, db):
        cat = make_category(db, name="Electronics")
        assert cat.id is not None
        assert cat.name == "Electronics"
 
    def test_category_name_must_be_unique(self, db):
        make_category(db, name="Stationery")
        duplicate = Category(name="Stationery")
        db.session.add(duplicate)
        with pytest.raises(Exception):  # IntegrityError
            db.session.flush()
 
    def test_category_products_backref(self, db):
        """Products added under a category should appear in category.products."""
        cat = make_category(db, name="Office")
        sup = make_supplier(db)
        make_product(db, category_id=cat.id, supplier_id=sup.id, name="Desk")
        make_product(db, category_id=cat.id, supplier_id=sup.id, name="Chair")
        assert len(cat.products) == 2
 
 
# ── Supplier ──────────────────────────────────────────────────────────────────
 
class TestSupplierModel:
 
    def test_creates_supplier(self, db):
        sup = make_supplier(db, name="Tech Imports")
        assert sup.id is not None
        assert sup.name == "Tech Imports"
 
    def test_contact_info_is_optional(self, db):
        sup = Supplier(name="No Contact Supplier")
        db.session.add(sup)
        db.session.flush()
        assert sup.contact_info is None
 
    def test_supplier_products_backref(self, db):
        """Products linked to a supplier should appear in supplier.products."""
        cat = make_category(db)
        sup = make_supplier(db, name="Gadget Co")
        make_product(db, category_id=cat.id, supplier_id=sup.id, name="Phone")
        assert len(sup.products) == 1
        assert sup.products[0].name == "Phone"
 
 
# ── Product ───────────────────────────────────────────────────────────────────
 
class TestProductModel:
 
    def test_creates_product(self, db):
        cat = make_category(db)
        sup = make_supplier(db)
        product = make_product(db, category_id=cat.id, supplier_id=sup.id)
        assert product.id is not None
        assert product.name == "Laptop"
        assert product.price == 999.99
        assert product.stock_quantity == 10
 
    def test_rejects_zero_price(self, db):
        with pytest.raises(ValueError, match="Price must be greater than 0"):
            Product(name="Free Item", price=0, stock_quantity=5, category_id=1)
 
    def test_rejects_negative_price(self, db):
        with pytest.raises(ValueError, match="Price must be greater than 0"):
            Product(name="Broken Item", price=-10, stock_quantity=5, category_id=1)
 
    def test_rejects_negative_stock(self, db):
        with pytest.raises(ValueError, match="Stock quantity cannot be negative"):
            Product(name="Ghost Stock", price=100, stock_quantity=-1, category_id=1)
 
    def test_stock_quantity_can_be_zero(self, db):
        """Zero stock is valid — it means the item is out of stock, not corrupt data."""
        cat = make_category(db)
        product = make_product(db, category_id=cat.id, qty=0)
        assert product.stock_quantity == 0
 
    def test_supplier_is_optional(self, db):
        cat = make_category(db)
        product = make_product(db, category_id=cat.id, supplier_id=None)
        assert product.supplier_id is None
 
    def test_product_belongs_to_category(self, db):
        cat = make_category(db, name="Tools")
        product = make_product(db, category_id=cat.id)
        assert product.category.name == "Tools"
 
 
# ── StockTransaction ──────────────────────────────────────────────────────────
 
class TestStockTransactionModel:
 
    def _make_transaction(self, db, type="IN", quantity=5, reference=None):
        """Helper that creates the required parent records then returns a transaction."""
        cat  = make_category(db)
        sup  = make_supplier(db)
        user = make_user(db)
        prod = make_product(db, category_id=cat.id, supplier_id=sup.id)
        txn  = StockTransaction(
            product_id=prod.id,
            user_id=user.id,
            quantity=quantity,
            type=type,
            reference=reference,
        )
        db.session.add(txn)
        db.session.flush()
        return txn
 
    def test_creates_stock_in_transaction(self, db):
        txn = self._make_transaction(db, type="IN", quantity=20)
        assert txn.id is not None
        assert txn.type == "IN"
        assert txn.quantity == 20
 
    def test_creates_stock_out_transaction(self, db):
        txn = self._make_transaction(db, type="OUT", quantity=5)
        assert txn.type == "OUT"
 
    def test_rejects_invalid_type(self, db):
        with pytest.raises(ValueError, match="Transaction type must be"):
            StockTransaction(product_id=1, user_id=1, quantity=5, type="TRANSFER")
 
    def test_rejects_zero_quantity(self, db):
        with pytest.raises(ValueError, match="Quantity must be greater than 0"):
            StockTransaction(product_id=1, user_id=1, quantity=0, type="IN")
 
    def test_rejects_negative_quantity(self, db):
        with pytest.raises(ValueError, match="Quantity must be greater than 0"):
            StockTransaction(product_id=1, user_id=1, quantity=-3, type="IN")
 
    def test_created_at_is_set_automatically(self, db):
        txn = self._make_transaction(db)
        assert txn.created_at is not None
 
    def test_reference_is_optional(self, db):
        txn = self._make_transaction(db, reference=None)
        assert txn.reference is None
 
    def test_reference_stores_value(self, db):
        txn = self._make_transaction(db, reference="PO-2024-001")
        assert txn.reference == "PO-2024-001"
 
    def test_transaction_links_to_user(self, db):
        """transaction.user should return the User object."""
        txn = self._make_transaction(db)
        assert txn.user is not None
        assert txn.user.username == "alice"
 
    def test_transaction_links_to_product(self, db):
        """transaction.product should return the Product object (via backref)."""
        txn = self._make_transaction(db)
        assert txn.product is not None
        assert txn.product.name == "Laptop"
 
    def test_user_transactions_backpopulate(self, db):
        """user.transactions should list all transactions for that user."""
        cat  = make_category(db)
        user = make_user(db)
        prod = make_product(db, category_id=cat.id)
 
        for _ in range(3):
            db.session.add(StockTransaction(
                product_id=prod.id, user_id=user.id, quantity=2, type="IN"
            ))
        db.session.flush()
 
        assert len(user.transactions) == 3
 