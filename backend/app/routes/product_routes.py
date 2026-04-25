from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.product import Product
from app.models.category import Category
from app.models.supplier import Supplier
from app.decorators import role_required
from app import db

product_bp = Blueprint('products', __name__, url_prefix='/products')

# GET all products (any logged-in user)
@product_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

# GET single product
@product_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict()), 200

# CREATE product (admin or manager only)
@product_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(['admin', 'manager'])
def create_product():
    data = request.get_json()
    
    # Required fields
    required = ['name', 'price', 'category_id', 'supplier_id']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Validate price
    if data['price'] <= 0:
        return jsonify({'error': 'Price must be greater than 0'}), 400
    
    # Check category exists
    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({'error': 'Category not found'}), 400
    
    # Check supplier exists
    supplier = Supplier.query.get(data['supplier_id'])
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 400
    
    product = Product(
        name=data['name'],
        price=data['price'],
        stock_quantity=data.get('stock_quantity', 0),
        category_id=data['category_id'],
        supplier_id=data['supplier_id']
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

# UPDATE product (admin or manager only)
@product_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
@role_required(['admin', 'manager'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        product.name = data['name']
    if 'price' in data:
        if data['price'] <= 0:
            return jsonify({'error': 'Price must be greater than 0'}), 400
        product.price = data['price']
    if 'stock_quantity' in data:
        if data['stock_quantity'] < 0:
            return jsonify({'error': 'Stock quantity cannot be negative'}), 400
        product.stock_quantity = data['stock_quantity']
    if 'category_id' in data:
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Category not found'}), 400
        product.category_id = data['category_id']
    if 'supplier_id' in data:
        supplier = Supplier.query.get(data['supplier_id'])
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 400
        product.supplier_id = data['supplier_id']
    
    db.session.commit()
    return jsonify(product.to_dict()), 200

# DELETE product (admin only)
@product_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200