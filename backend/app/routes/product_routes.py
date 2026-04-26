from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product import Product
from app.models.user import User
from app.models.stock_transaction import StockTransaction, MovementType
from app.schemas.product_schema import ProductSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

product_bp = Blueprint("products", __name__, url_prefix="/products")
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)


@product_bp.route("", methods=["GET"])
@jwt_required()
def get_products():
    try:
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
    except Exception as e:
        return jsonify({"error": "Failed to fetch products", "details": str(e)}), 500


@product_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_product(id):
    try:
        product = db.session.get(Product, id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product_schema.dump(product)), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch product", "details": str(e)}), 500


@product_bp.route("", methods=["POST"])
@jwt_required()
def create_product():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        errors = product_schema.validate(data)
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        user_id = int(get_jwt_identity())
        initial_qty = int(data.get("quantity", 0))

        new_product = Product(
            name=data.get("name"),
            description=data.get("description"),
            price=float(data.get("price")),
            quantity=initial_qty,
            category_id=data.get("category_id"),
            supplier_id=data.get("supplier_id"),
            created_by=user_id,
        )
        db.session.add(new_product)
        db.session.flush()

        if initial_qty > 0:
            opening_txn = StockTransaction(
                product_id=new_product.id,
                user_id=user_id,
                movement_type=MovementType("in"),
                quantity=initial_qty,
                stock_level=initial_qty,
                notes="Opening stock on product creation",
            )
            db.session.add(opening_txn)

        db.session.commit()
        return jsonify(product_schema.dump(new_product)), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create product", "details": str(e)}), 500


@product_bp.route("/<int:id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_product(id):
    try:
        product = db.session.get(Product, id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.role == "staff" and product.created_by != user_id:
            return jsonify({"error": "Not authorized to edit this product"}), 403

        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        errors = product_schema.validate(data, partial=True)
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        product.name = data.get("name", product.name)
        product.description = data.get("description", product.description)
        product.price = float(data.get("price", product.price))
        product.quantity = int(data.get("quantity", product.quantity))
        product.category_id = data.get("category_id", product.category_id)
        product.supplier_id = data.get("supplier_id", product.supplier_id)

        db.session.commit()
        return jsonify(product_schema.dump(product)), 200

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update product", "details": str(e)}), 500


@product_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    try:
        product = db.session.get(Product, id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.role == "staff" and product.created_by != user_id:
            return jsonify({"error": "Not authorized to delete this product"}), 403

        db.session.delete(product)
        db.session.commit()
        return "", 204

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete product", "details": str(e)}), 500
