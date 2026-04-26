from app import db
from sqlalchemy.orm import validates
from datetime import datetime, timezone
from enum import Enum


class MovementType(Enum):
    IN = "in"
    OUT = "out"


class StockTransaction(db.Model):
    __tablename__ = "stock_transactions"

    id = db.Column(db.Integer, primary_key=True)

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    quantity = db.Column(db.Integer, nullable=False)

    movement_type = db.Column(
        db.Enum(MovementType),
        nullable=False
    )

    #  snapshot of stock AFTER transaction
    stock_level = db.Column(db.Integer, nullable=False)

    reference = db.Column(db.String(200))
    notes = db.Column(db.Text)

    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    product = db.relationship("Product", back_populates="transactions")
    user = db.relationship("User", back_populates="transactions")

    # Validation
    @validates("quantity")
    def validate_quantity(self, key, value):
        if value <= 0:
            raise ValueError("Quantity must be greater than 0")
        return value

    #  Soft delete
    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = datetime.now(timezone.utc)

    @property
    def is_inbound(self):
        return self.movement_type == MovementType.IN

    @property
    def is_outbound(self):
        return self.movement_type == MovementType.OUT

    def __repr__(self):
        status = "DELETED" if self.is_deleted else "ACTIVE"
        return (
            f"<StockTransaction [{status}] "
            f"[{self.movement_type.value.upper()}] "
            f"qty={self.quantity} stock={self.stock_level} "
            f"product_id={self.product_id}>"
        )
