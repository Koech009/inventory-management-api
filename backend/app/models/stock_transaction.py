from . import db
from sqlalchemy.orm import validates
from datetime import datetime
 
VALID_TYPES = {"IN", "OUT"}
 
 
class StockTransaction(db.Model):
    __tablename__ = "stock_transactions"
 
    id         = db.Column(db.Integer, primary_key=True)
    # FK → products.id — every transaction must reference a product
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    # FK → users.id — every transaction must be recorded by a user
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    quantity   = db.Column(db.Integer, nullable=False)
    # type is either "IN" (stock received) or "OUT" (stock dispatched)
    type       = db.Column(db.String(3), nullable=False)
    # reference is optional — holds a PO number, invoice ID, or note
    reference  = db.Column(db.String(200))
    # Timestamp auto-set on creation — never needs to be passed manually
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
 
    # Many transactions belong to one product (other side in Product.transactions)
    product = db.relationship("Product", back_populates="transactions")
    # Many transactions belong to one user (other side in User.transactions)
    user    = db.relationship("User", back_populates="transactions")
 
    @validates("quantity")
    def validate_quantity(self, key, value):
        """Every transaction must move at least 1 unit."""
        if value <= 0:
            raise ValueError("Quantity must be greater than 0")
        return value
 
    @validates("type")
    def validate_type(self, key, value):
        """Only IN or OUT are valid transaction types."""
        if value not in VALID_TYPES:
            raise ValueError("Transaction type must be 'IN' or 'OUT'")
        return value
 
    def __repr__(self):
        return f"<StockTransaction {self.type} qty={self.quantity} product_id={self.product_id}>"