from app import db
from sqlalchemy.orm import validates
from datetime import datetime, timezone
from enum import Enum


class MovementType(Enum):
    # IN movements
    PURCHASE = "purchase"
    RESTOCK = "restock"
    INITIAL_LOAD = "initial_load"

    # OUT movements
    SALE = "sale"
    USAGE = "usage"
    DISPOSAL = "disposal"


IN_TYPES = {MovementType.PURCHASE,
            MovementType.RESTOCK, MovementType.INITIAL_LOAD}


class StockTransaction(db.Model):
    __tablename__ = "stock_transactions"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey(
        "products.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    movement_type = db.Column(db.Enum(MovementType), nullable=False)
    reference = db.Column(db.String(200))
    notes = db.Column(db.Text)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

    product = db.relationship("Product", back_populates="transactions")
    user = db.relationship("User", back_populates="transactions")

    # --- Validations ---
    @validates("quantity")
    def validate_quantity(self, key, value):
        """Every transaction must move at least 1 unit."""
        if value <= 0:
            raise ValueError("Quantity must be greater than 0")
        return value

    @property
    def is_inbound(self):
        """Returns True if this transaction adds stock."""
        return self.movement_type in IN_TYPES

    @property
    def is_outbound(self):
        """Returns True if this transaction removes stock."""
        return self.movement_type not in IN_TYPES

    def __repr__(self):
        direction = "IN" if self.is_inbound else "OUT"
        return f"<StockTransaction [{direction}] {self.movement_type.value} qty={self.quantity} product_id={self.product_id}>"
