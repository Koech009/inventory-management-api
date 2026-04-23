from . import db
from sqlalchemy.orm import validates
 
VALID_ROLES = {"admin", "manager", "staff"}
 
 
class User(db.Model):
    __tablename__ = "users"
 
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    # Role controls access levels — used by the RBAC decorator in routes
    role          = db.Column(db.String(20), nullable=False, default="staff")
 
    # One user can record many stock transactions (other side in StockTransaction.user)
    transactions = db.relationship("StockTransaction", back_populates="user")
 
    @validates("role")
    def validate_role(self, key, value):
        """Reject any role outside the allowed set before the row is saved."""
        if value not in VALID_ROLES:
            raise ValueError(f"Role must be one of: {VALID_ROLES}")
        return value
 
    def __repr__(self):
        return f"<User {self.username!r} role={self.role!r}>"