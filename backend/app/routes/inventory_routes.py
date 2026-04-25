from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product import Product
from app.models.stock_transaction import StockTransaction
from app.schemas.stock_transaction_schema import StockTransactionSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

inventory_bp = Blueprint("inventory", __name__, url_prefix="/inventory")

transaction_schema = StockTransactionSchema()
transactions_schema = StockTransactionSchema(many=True)


@inventory_bp.route("", methods=["POST"])
@jwt_required()
def create_transaction():
    """
    Create a new inventory transaction.
    Validates the request data, checks movement_type against transaction type,
    adjusts the product's stock quantity accordingly, and saves the transaction.
    Returns 400 if validation fails or stock is insufficient for 'out' transactions.
    Returns the created transaction with a 201 status code.
    """
    data = request.get_json()

    errors = transaction_schema.validate(data)
    if errors:
        print("Validation errors:", errors)
        return jsonify(errors), 400

    user_id = get_jwt_identity()

    product = db.session.get(Product, data["product_id"])
    if not product:
        return jsonify({"error": "Product not found"}), 404

    txn_type = data["type"]
    movement_type = data["movement_type"].lower()
    quantity = data["quantity"]

    # Valid movement types per transaction direction
    valid_in = ["purchase", "restock", "initial_load"]
    valid_out = ["sale", "usage", "disposal"]

    if txn_type == "in" and movement_type not in valid_in:
        return jsonify({"error": "Invalid movement_type for 'in' transaction"}), 400
    if txn_type == "out" and movement_type not in valid_out:
        return jsonify({"error": "Invalid movement_type for 'out' transaction"}), 400

    if txn_type == "in":
        product.quantity += quantity
    elif txn_type == "out":
        if product.quantity < quantity:
            return jsonify({"error": "Not enough stock"}), 400
        product.quantity -= quantity

    transaction = StockTransaction(
        product_id=product.id,
        user_id=user_id,
        type=txn_type,
        movement_type=movement_type,
        quantity=quantity,
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify(transaction_schema.dump(transaction)), 201


@inventory_bp.route("", methods=["GET"])
@jwt_required()
def get_transactions():
    """
    Retrieve a paginated list of all inventory transactions.
    Ordered by most recent first. Supports `page` and `per_page` query params
    (max 100 per page). Returns transactions with pagination metadata.
    """
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 100, type=int), 100)

    pagination = StockTransaction.query.order_by(
        StockTransaction.id.desc()
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


@inventory_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_transaction(id):
    """
    Retrieve a single inventory transaction by its ID.
    Returns 404 if the transaction does not exist.
    """
    transaction = db.session.get(StockTransaction, id)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404
    return jsonify(transaction_schema.dump(transaction)), 200


@inventory_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(id):
    """
    Delete an inventory transaction by its ID and reverse its stock effect.
    If the transaction was 'in', stock is decremented.
    If the transaction was 'out', stock is restored.
    Returns 404 if the transaction or its product does not exist.
    Returns 204 No Content on successful deletion.
    """
    transaction = db.session.get(StockTransaction, id)
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    product = db.session.get(Product, transaction.product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Reverse the stock effect of this transaction
    if transaction.type == "in":
        product.quantity -= transaction.quantity
    elif transaction.type == "out":
        product.quantity += transaction.quantity

    db.session.delete(transaction)
    db.session.commit()
    return "", 204
