from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product import Product
from app.models.user import User
from app.schemas.product_schema import ProductSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

product_bp = Blueprint("products", __name__, url_prefix="/products")
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)


@product_bp.route("", methods=["GET"])
@jwt_required()
def get_products():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 100, type=int), 100)

    pagination = Product.query.order_by(Product.id.asc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "products": products_schema.dump(pagination.items),
        "meta": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_items": pagination.total,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
            "next_page": pagination.next_num,
            "prev_page": pagination.prev_num,
        }
    }), 200


@product_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product_schema.dump(product)), 200


@product_bp.route("", methods=["POST"])
@jwt_required()
def create_product():
    data = request.get_json()
    user_id = get_jwt_identity()

    new_product = Product(
        name=data.get("name"),
        description=data.get("description"),
        price=data.get("price"),
        quantity=data.get("quantity", 0),
        category_id=data.get("category_id"),
        supplier_id=data.get("supplier_id"),
        created_by=user_id,
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(product_schema.dump(new_product)), 201


@product_bp.route("/<int:id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user.role == "staff" and product.created_by != user_id:
        return jsonify({"error": "Not authorized to edit this product"}), 403

    data = request.get_json()
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.quantity = data.get("quantity", product.quantity)
    product.category_id = data.get("category_id", product.category_id)
    product.supplier_id = data.get("supplier_id", product.supplier_id)

    db.session.commit()
    return jsonify(product_schema.dump(product)), 200


@product_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user.role == "staff" and product.created_by != user_id:
        return jsonify({"error": "Not authorized to delete this product"}), 403

    db.session.delete(product)
    db.session.commit()
    return "", 204
