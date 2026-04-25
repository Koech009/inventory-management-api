from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.supplier import Supplier
from app.decorators import role_required
from app import db

supplier_bp = Blueprint('suppliers', __name__, url_prefix='/suppliers')

@supplier_bp.route('/', methods=['GET'])
@jwt_required()
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([s.to_dict() for s in suppliers]), 200

@supplier_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(['admin', 'manager'])
def create_supplier():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    supplier = Supplier(
        name=data['name'],
        contact_info=data.get('contact_info', '')
    )
    db.session.add(supplier)
    db.session.commit()
    
    return jsonify(supplier.to_dict()), 201