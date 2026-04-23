from . import db
 
 
class Category(db.Model):
    __tablename__ = "categories"
 
    id   = db.Column(db.Integer, primary_key=True)
    # Category names must be unique — e.g. "Electronics", "Stationery"
    name = db.Column(db.String(100), unique=True, nullable=False)
 
    # One category has many products (other side in Product.category)
    products = db.relationship("Product", back_populates="category")
 
    def __repr__(self):
        return f"<Category {self.name!r}>"