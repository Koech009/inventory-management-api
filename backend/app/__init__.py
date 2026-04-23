from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_cors import CORS  # <-- ADD THIS
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS - allow your frontend origin
    CORS(app, origins=["http://127.0.0.1:5173", "http://localhost:5173"], supports_credentials=True)
    
    db.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)
    
    # Import models
    from .models import User, Category, Supplier, Product, StockTransaction
    
    # Import and register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.product_routes import product_bp
    from .routes.inventory_routes import inventory_bp
    from .routes.category_routes import category_bp
    from .routes.supplier_routes import supplier_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(supplier_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app