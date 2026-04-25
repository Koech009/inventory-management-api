from app import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    # roles: admin, manager, staff
    role = db.Column(db.String(20), default="staff")

    # relationship to track inventory transactions
    transactions = db.relationship(
        "StockTransaction", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        raise AttributeError("Password is not readable")

    @password.setter
    def password(self, value):
        """Hash and set the user password using bcrypt."""
        self.password_hash = bcrypt.generate_password_hash(
            value).decode("utf-8")

    def check_password(self, value):
        """Verify the user password using bcrypt."""
        return bcrypt.check_password_hash(self.password_hash, value)

    def __repr__(self):
        return f"<User {self.username} {self.email} {self.role} >"
