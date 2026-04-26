from flask_jwt_extended import jwt_required, get_jwt_identity
from app.schemas.stock_transaction_schema import StockTransactionSchema
from app.models.stock_transaction import StockTransaction, MovementType
from app.models.product import Product
from app.extensions import db
from flask import Blueprint, request, jsonify


inventory_bp = Blueprint("inventory", __name__, url_prefix="/inventory")

transaction_schema = StockTransactionSchema()
transactions_schema = StockTransactionSchema(many=True)


# CREATE TRANSACTION
@inventory_bp.route("", methods=["POST"])
@jwt_required()
def create_transaction():
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity())

        product_id = data.get("product_id")
        movement_type = str(data.get("movement_type", "")).lower()
        quantity = int(data.get("quantity", 0))

        #  Validate product
        product = db.session.get(Product, product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Validate movement
        if movement_type not in ["in", "out"]:
            return jsonify({"error": "movement_type must be 'in' or 'out'"}), 400

        if quantity <= 0:
            return jsonify({"error": "Quantity must be greater than 0"}), 400

        # Update stock
        if movement_type == "in":
            product.quantity += quantity
        else:
            if product.quantity < quantity:
                return jsonify({
                    "error": f"Not enough stock. Current: {product.quantity}, requested: {quantity}"
                }), 400
            product.quantity -= quantity

        #  Create transaction WITH stock snapshot
        transaction = StockTransaction(
            product_id=product.id,
            user_id=user_id,
            movement_type=MovementType(movement_type),
            quantity=quantity,
            notes=data.get("notes"),
            reference=data.get("reference"),
            stock_level=product.quantity
        )

        db.session.add(transaction)
        db.session.commit()

        return jsonify(transaction_schema.dump(transaction)), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to create transaction",
            "details": str(e)
        }), 500


# GET ALL TRANSACTIONS
@inventory_bp.route("", methods=["GET"])
@jwt_required()
def get_transactions():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 100, type=int), 100)

        pagination = StockTransaction.query.order_by(
            StockTransaction.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "transactions": transactions_schema.dump(pagination.items),
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
        return jsonify({
            "error": "Failed to fetch transactions",
            "details": str(e)
        }), 500


#  GET SINGLE TRANSACTION
@inventory_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_transaction(id):
    try:
        transaction = db.session.get(StockTransaction, id)
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        return jsonify(transaction_schema.dump(transaction)), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch transaction",
            "details": str(e)
        }), 500


#  SOFT DELETE TRANSACTION
@inventory_bp.route("/<int:id>/delete", methods=["PATCH"])
@jwt_required()
def soft_delete_transaction(id):
    try:
        transaction = db.session.get(StockTransaction, id)
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        if transaction.is_deleted:
            return jsonify({"error": "Transaction already deleted"}), 400

        product = db.session.get(Product, transaction.product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Reverse stock safely
        if transaction.movement_type == MovementType.IN:
            if product.quantity < transaction.quantity:
                return jsonify({
                    "error": "Cannot reverse transaction, stock too low"
                }), 400
            product.quantity -= transaction.quantity
        else:
            product.quantity += transaction.quantity

        transaction.soft_delete()
        db.session.commit()

        return jsonify({"message": "Transaction deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to delete transaction",
            "details": str(e)
        }), 500
