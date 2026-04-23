# app/routes/__init__.py
from flask import Blueprint

from .auth_routes import auth_bp
from .product_routes import product_bp
from .inventory_routes import inventory_bp
# other imports...

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(inventory_bp)
    # register others...