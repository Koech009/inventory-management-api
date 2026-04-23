# inventory_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.product import Product
from app.models.stock_transaction import StockTransaction
from app.models.user import User
from app import db

inventory_bp = Blueprint('inventory', __name__, url_prefix='/inventory')

def has_role(allowed_roles):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user and user.role in allowed_roles


@inventory_bp.route('/stock-in', methods=['POST'])
@jwt_required()
def stock_in():
    if not has_role(['admin', 'manager', 'staff']):
        return jsonify({'error': 'Forbidden'}), 403
    
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    reference = data.get('reference', '')
    
    if not product_id or not quantity:
        return jsonify({'error': 'product_id and quantity required'}), 400
    if quantity <= 0:
        return jsonify({'error': 'Quantity must be positive'}), 400
    
    product = Product.query.get_or_404(product_id)
    product.stock_quantity += quantity
    
    transaction = StockTransaction(
        product_id=product.id,
        user_id=get_jwt_identity(),
        quantity=quantity,
        type='IN',
        reference=reference
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Stock added',
        'new_quantity': product.stock_quantity,
        'transaction_id': transaction.id
    }), 200


@inventory_bp.route('/stock-out', methods=['POST'])
@jwt_required()
def stock_out():
    if not has_role(['admin', 'manager', 'staff']):
        return jsonify({'error': 'Forbidden'}), 403
    
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    reference = data.get('reference', '')
    
    if not product_id or not quantity:
        return jsonify({'error': 'product_id and quantity required'}), 400
    if quantity <= 0:
        return jsonify({'error': 'Quantity must be positive'}), 400
    
    product = Product.query.get_or_404(product_id)
    if product.stock_quantity < quantity:
        return jsonify({'error': 'Insufficient stock'}), 400
    
    product.stock_quantity -= quantity
    
    transaction = StockTransaction(
        product_id=product.id,
        user_id=get_jwt_identity(),
        quantity=quantity,
        type='OUT',
        reference=reference
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Stock removed',
        'new_quantity': product.stock_quantity,
        'transaction_id': transaction.id
    }), 200


@inventory_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    product_id = request.args.get('product_id')
    
    if product_id:
        transactions = StockTransaction.query.filter_by(product_id=product_id).order_by(StockTransaction.created_at.desc()).all()
    else:
        transactions = StockTransaction.query.order_by(StockTransaction.created_at.desc()).all()
    
    return jsonify([t.to_dict() for t in transactions]), 200