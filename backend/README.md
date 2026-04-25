# 📦 Inventory Management API (Backend)

A scalable, role-based inventory management backend built with **Flask**, **SQLAlchemy**, **Marshmallow**, and **JWT Authentication**.
It provides secure authentication, clean API design, and robust inventory operations suitable for real-world applications and assessments.

---

## 🚀 Tech Stack

- **Flask** – Lightweight web framework
- **Flask-SQLAlchemy** – ORM for database models
- **Flask-Migrate** – Database migrations (Alembic)
- **Flask-Marshmallow** – Serialization & validation
- **Flask-JWT-Extended** – Authentication & authorization
- **Flask-Bcrypt** – Password hashing
- **Flask-CORS** – Cross-origin support
- **Pytest** – Testing framework

---

## 📂 Project Structure

```
backend/
│── app/
│   ├── __init__.py            # App factory
│   ├── extensions.py         # Centralized extensions (db, jwt, bcrypt, migrate, cors)
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── supplier.py
│   │   └── stock_transaction.py
│   ├── schemas/              # Marshmallow schemas
│   │   ├── user_schema.py
│   │   ├── product_schema.py
│   │   ├── category_schema.py
│   │   ├── supplier_schema.py
│   │   └── stock_transaction_schema.py
│   ├── routes/               # API routes (Blueprints)
│   │   ├── auth_routes.py
│   │   ├── user_routes.py
│   │   ├── product_routes.py
│   │   ├── category_routes.py
│   │   ├── supplier_routes.py
│   │   └── inventory_routes.py
│   └── config.py             # App configuration
│
├── migrations/               # Alembic migration files
├── tests/                    # Pytest suite
│   ├── conftest.py
│   ├── test_auth_routes.py
│   ├── test_models.py
│   ├── test_routes.py
│   └── test_schemas.py
│
├── instance/                 # SQLite DB (development/testing)
├── requirements.txt / Pipfile
└── README.md
```

---

## 🔑 Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Protected routes
- Role-based access control (**admin, manager, staff**)

### 👤 User Management

- Create, update, and delete users
- Role assignment and control
- Secure password hashing with bcrypt

### 📦 Products

- Full CRUD operations
- Ownership and validation checks
- Pagination support

### 🗂 Categories

- CRUD operations
- Duplicate prevention
- Pagination support

### 🚚 Suppliers

- CRUD operations
- Duplicate name/email validation
- Pagination support

### 🔄 Inventory Transactions

- Stock **in/out** operations
- Movement type validation
- Transaction history with pagination
- Safe deletion (reverses stock impact)

### ⚠️ Error Handling

- Consistent JSON responses
- Handles 400, 404, 500 errors gracefully

### 🧪 Testing

- Pytest coverage for:
  - Models
  - Schemas
  - Routes
  - Authentication

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Koech009/inventory-management-api.git
cd inventory-management-api/backend
```

### 2. Install Dependencies

```bash
pipenv install --dev
pipenv shell
```

### 3. Environment Variables

Create a `.env` file:

```
FLASK_ENV=development
SQLALCHEMY_DATABASE_URI=sqlite:///instance/app.db
JWT_SECRET_KEY=your-secret-key
```

### 4. Run Database Migrations

```bash
flask db init
flask db migrate
flask db upgrade
```

### 5. Start the Server

```bash
flask run
```

---

## 🧪 Running Tests

```bash
pytest -v
```

---

## 📡 API Endpoints

### 🔐 Auth

- `POST /api/auth/register` → Register user
- `POST /api/auth/login` → Login and get JWT
- `POST /api/auth/logout` → Logout
- `GET /api/auth/me` → Current user
- `GET /api/auth/stats` → Public stats

### 👤 Users

- `GET /api/users` → List users
- `GET /api/users/<id>` → Get user
- `PUT/PATCH /api/users/<id>` → Update user
- `DELETE /api/users/<id>` → Delete user

### 📦 Products

- `GET /api/products` → List products (paginated)
- `GET /api/products/<id>` → Get product
- `POST /api/products` → Create product
- `PUT/PATCH /api/products/<id>` → Update product
- `DELETE /api/products/<id>` → Delete product

### 🗂 Categories

- `GET /api/categories` → List categories
- `POST /api/categories` → Create category
- `GET /api/categories/<id>` → Get category
- `PUT/PATCH /api/categories/<id>` → Update category
- `DELETE /api/categories/<id>` → Delete category

### 🚚 Suppliers

- `GET /api/suppliers` → List suppliers
- `POST /api/suppliers` → Create supplier
- `GET /api/suppliers/<id>` → Get supplier
- `PUT/PATCH /api/suppliers/<id>` → Update supplier
- `DELETE /api/suppliers/<id>` → Delete supplier

### 🔄 Inventory

- `POST /api/inventory` → Create transaction
- `GET /api/inventory` → Transaction history
- `GET /api/inventory/<id>` → Get transaction
- `DELETE /api/inventory/<id>` → Delete transaction (reverses stock)

---

## 📌 Notes

- Default roles: **staff, manager, admin**
- Passwords are securely hashed using bcrypt
- JWT is required for all protected routes
- Pagination defaults:
  - `page=1`
  - `per_page=100`

---

## 💡 Future Improvements

- API documentation with Swagger / OpenAPI
- Rate limiting for security
- Docker support
- CI/CD integration

---

## 📄 License

This project is open-source and available under the **MIT License**.
