from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.category import Category
from app.decorators import role_required
from app import db

category_bp = Blueprint('categories', __name__, url_prefix='/categories')

@category_bp.route('/', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

@category_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(['admin', 'manager'])
def create_category():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    existing = Category.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'error': 'Category already exists'}), 409
    
    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201