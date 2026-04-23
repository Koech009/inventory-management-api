from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

product_bp = Blueprint('products', __name__, url_prefix='/products')

@product_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    return jsonify({'message': 'Products endpoint working'}), 200