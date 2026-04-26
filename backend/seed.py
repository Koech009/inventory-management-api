import random
from datetime import datetime
from faker import Faker

from app import create_app, db, bcrypt
from app.models.user import User
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.stock_transaction import StockTransaction, MovementType

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

    # Staff/manager users
    for _ in range(5):
        user = User(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password=bcrypt.generate_password_hash(
                "password123").decode("utf-8"),
            role=random.choice(["staff", "manager"])
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
        print("Seeding transactions...")
        for _ in range(20):
            product = random.choice(products)
            user = random.choice(users)
            movement = random.choice([MovementType.IN, MovementType.OUT])
            qty = random.randint(1, 20)

            # Update product quantity and compute stock level
            if movement == MovementType.IN:
                product.quantity += qty
            else:
                product.quantity = max(product.quantity - qty, 0)

            transaction = StockTransaction(
                product_id=product.id,
                user_id=user.id,
                movement_type=movement,
                quantity=qty,
                stock_level=product.quantity,
                notes=fake.sentence() if random.random() > 0.5 else None,
                is_deleted=False,
                created_at=datetime.utcnow()
            )
            db.session.add(transaction)

        db.session.commit()
        print("Seeding completed successfully!")


if __name__ == "__main__":
    seed_db()
