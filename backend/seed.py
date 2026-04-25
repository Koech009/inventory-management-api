from app import create_app, db, bcrypt
from app.models.user import User
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.stock_transaction import StockTransaction
from faker import Faker
import random

fake = Faker()
app = create_app()


def seed_users():
    print("Seeding users...")
    users = []

    # Admin user
    admin = User(
        username="admin",
        email="admin@example.com",
        password=bcrypt.generate_password_hash("admin123").decode("utf-8"),
        role="admin"
    )
    db.session.add(admin)
    users.append(admin)

    # Fake staff/admin users
    for _ in range(5):
        user = User(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password=bcrypt.generate_password_hash(
                "password123").decode("utf-8"),
            role=random.choice(["staff", "staff", "admin"])
        )
        db.session.add(user)
        users.append(user)

    db.session.commit()
    return users


def seed_db():
    with app.app_context():
        print("Resetting database...")
        db.drop_all()
        db.create_all()

        # -------------------
        # USERS
        # -------------------
        users = seed_users()

        # -------------------
        # CATEGORIES
        # -------------------
        categories = []
        for _ in range(5):
            category = Category(
                name=fake.unique.word().capitalize(),
                description=fake.sentence()
            )
            db.session.add(category)
            categories.append(category)
        db.session.commit()

        # -------------------
        # SUPPLIERS
        # -------------------
        suppliers = []
        for _ in range(5):
            supplier = Supplier(
                name=fake.unique.company(),
                contact_email=fake.unique.email(),
                phone=fake.phone_number(),
                address=fake.address()
            )
            db.session.add(supplier)
            suppliers.append(supplier)
        db.session.commit()

        # -------------------
        # PRODUCTS
        # -------------------
        products = []
        for _ in range(10):
            product = Product(
                name=fake.unique.word().capitalize(),
                description=fake.text(max_nb_chars=100),
                price=round(random.uniform(5, 500), 2),
                quantity=random.randint(10, 200),
                category_id=random.choice(categories).id,
                supplier_id=random.choice(suppliers).id
            )
            db.session.add(product)
            products.append(product)
        db.session.commit()

        # -------------------
        # STOCK TRANSACTIONS
        # -------------------
        movement_types = ["purchase", "restock",
                          "initial_load", "sale", "usage", "disposal"]

        for _ in range(20):
            transaction = StockTransaction(
                product_id=random.choice(products).id,
                user_id=random.choice(users).id,
                #  lowercase to match schema
                type=random.choice(["in", "out"]),
                quantity=random.randint(1, 20),
                movement_type=random.choice(movement_types)
                # date will be auto-set by model default
            )
            db.session.add(transaction)
        db.session.commit()

        print("Seeding completed successfully ")


if __name__ == "__main__":
    seed_db()
