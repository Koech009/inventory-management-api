from app import db
from sqlalchemy.orm import validates


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=0)
    category_id = db.Column(db.Integer, db.ForeignKey(
        "categories.id"), nullable=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey(
        "suppliers.id"), nullable=True)
    created_by = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=True)

    category = db.relationship("Category", back_populates="products")
    supplier = db.relationship("Supplier", back_populates="products")
    creator = db.relationship("User", foreign_keys=[created_by])
    transactions = db.relationship(
        "StockTransaction",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    @validates("price")
    def validate_price(self, key, value):
        value = float(value)  # ✅ cast before comparison
        if value <= 0:
            raise ValueError("Price must be greater than 0")
        return round(value, 2)

    @validates("quantity")
    def validate_quantity(self, key, value):
        value = int(value)  # ✅ cast before comparison
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        return value

    def __repr__(self):
        return f"<Product {self.name} {self.price} {self.quantity}>"
