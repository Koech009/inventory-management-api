from . import db
from sqlalchemy.orm import validates
 
 
class Product(db.Model):
    __tablename__ = "products"
 
    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(150), nullable=False)
    price          = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
 
    # FK → categories.id — every product must belong to a category
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    # FK → suppliers.id — nullable=True: supplier can be assigned after product creation
    supplier_id = db.Column(db.Integer, db.ForeignKey("suppliers.id"), nullable=True)
 
    # Many products belong to one category (other side in Category.products)
    category = db.relationship("Category", back_populates="products")
    # Many products belong to one supplier (other side in Supplier.products)
    supplier = db.relationship("Supplier", back_populates="products")
    # One product can appear in many stock transactions (other side in StockTransaction.product)
    transactions = db.relationship("StockTransaction", back_populates="product")
 
    @validates("price")
    def validate_price(self, key, value):
        """Price must be a positive number."""
        if value <= 0:
            raise ValueError("Price must be greater than 0")
        return value
 
    @validates("stock_quantity")
    def validate_stock_quantity(self, key, value):
        """Stock can reach zero but must never go negative."""
        if value < 0:
            raise ValueError("Stock quantity cannot be negative")
        return value
 
    def __repr__(self):
        return f"<Product {self.name!r} price={self.price} qty={self.stock_quantity}>"