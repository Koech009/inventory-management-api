from flask import Blueprint, jsonify, request
from app.extensions import db, bcrypt
from app.models.user import User
from flask_jwt_extended import jwt_required

user_bp = Blueprint("users", __name__)


@user_bp.route("", methods=["GET"])
@jwt_required()
def get_users():
    """
    Retrieve a list of all registered users ordered by ID ascending.
    Returns a plain array of user objects, each containing
    id, username, email, and role fields.
    """
    users = User.query.order_by(User.id.asc()).all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "role": u.role}
        for u in users
    ]), 200


@user_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    """
    Retrieve a single user by their ID.
    Returns 404 if no user with the given ID exists.
    Returns the user's id, username, email, and role on success.
    """
    u = db.session.get(User, id)
    if not u:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": u.id, "username": u.username, "email": u.email, "role": u.role
    }), 200


@user_bp.route("/<int:id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_user(id):
    """
    Update a user's details by their ID.
    Supports partial updates — any combination of role, username,
    email, and password can be provided. Role must be one of:
    'staff', 'manager', or 'admin'. Password is hashed before saving.
    Returns 404 if the user does not exist.
    Returns 400 if an invalid role is provided.
    """
    u = db.session.get(User, id)
    if not u:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    if "role" in data:
        if data["role"] not in ("staff", "manager", "admin"):
            return jsonify({"error": "Invalid role"}), 400
        u.role = data["role"]

    if "username" in data:
        u.username = data["username"]

    if "email" in data:
        u.email = data["email"]

    if "password" in data and data["password"]:
        u.password_hash = bcrypt.generate_password_hash(
            data["password"]).decode("utf-8")

    db.session.commit()
    return jsonify({
        "id": u.id, "username": u.username, "email": u.email, "role": u.role
    }), 200


@user_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    """
    Delete a user by their ID.
    Before deleting, cleans up related records to avoid integrity errors:
    - Deletes all stock transactions created by this user.
    - Sets created_by to NULL on any products they created.
    Returns 404 if the user does not exist.
    Returns 204 No Content on successful deletion.
    """
    u = db.session.get(User, id)
    if not u:
        return jsonify({"error": "User not found"}), 404

    from app.models.stock_transaction import StockTransaction
    from app.models.product import Product

    # Remove all inventory transactions linked to this user
    StockTransaction.query.filter_by(user_id=id).delete()

    # Disassociate products created by this user without deleting them
    Product.query.filter_by(created_by=id).update({"created_by": None})

    db.session.delete(u)
    db.session.commit()
    return "", 204
