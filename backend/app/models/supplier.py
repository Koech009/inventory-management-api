from app import db


class Supplier(db.Model):
    __tablename__ = "suppliers"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), unique=True, nullable=False)

    contact_email = db.Column(db.String(120), unique=True, nullable=False)

    phone = db.Column(db.String(20), nullable=True)

    address = db.Column(db.String(200), nullable=True)

    # Relationship
    products = db.relationship(
        "Product",
        back_populates="supplier",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Supplier {self.name} {self.contact_email} {self.phone} {self.address} >"
