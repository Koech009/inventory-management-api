from . import db
 
 
class Supplier(db.Model):
    __tablename__ = "suppliers"
 
    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(150), nullable=False)
    # contact_info is optional — can hold a phone number, email, or address
    contact_info = db.Column(db.String(255))
 
    # One supplier has many products (other side in Product.supplier)
    products = db.relationship("Product", back_populates="supplier")
 
    def __repr__(self):
        return f"<Supplier {self.name!r}>"