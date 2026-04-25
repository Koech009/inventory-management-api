from flask import Flask
from .config import Config
from app.extensions import db, migrate, jwt, bcrypt, cors


def create_app(testing=False):
    app = Flask(__name__)
    app.config.from_object(Config)

    if testing:
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        app.config["JWT_SECRET_KEY"] = "test-secret-key"
        app.config["WTF_CSRF_ENABLED"] = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.product_routes import product_bp
    from app.routes.category_routes import category_bp
    from app.routes.supplier_routes import supplier_bp
    from app.routes.inventory_routes import inventory_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(product_bp,   url_prefix="/api/products")
    app.register_blueprint(category_bp,  url_prefix="/api/categories")
    app.register_blueprint(supplier_bp,  url_prefix="/api/suppliers")
    app.register_blueprint(inventory_bp, url_prefix="/api/inventory")
    app.register_blueprint(user_bp,      url_prefix="/api/users")

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Resource not found"}, 404

    @app.errorhandler(400)
    def bad_request(error):
        return {"error": "Bad request"}, 400

    @app.shell_context_processor
    def make_shell_context():
        from app.models.user import User
        from app.models.category import Category
        from app.models.supplier import Supplier
        from app.models.product import Product
        from app.models.stock_transaction import StockTransaction
        return {
            "db": db,
            "User": User,
            "Category": Category,
            "Supplier": Supplier,
            "Product": Product,
            "StockTransaction": StockTransaction,
        }

    return app
