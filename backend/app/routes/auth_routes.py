from flask import Blueprint, request, jsonify
from app.extensions import db, bcrypt
from app.models.user import User
from app.schemas.user_schema import UserSchema
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
user_schema = UserSchema()


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 400

    user = User(
        username=data["username"],
        email=data["email"],
        role=data.get("role", "staff"),
    )
    user.password = data["password"]
    db.session.add(user)
    db.session.commit()

    return jsonify(user_schema.dump(user)), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user_schema.dump(user)}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    return jsonify(user_schema.dump(user)), 200


@auth_bp.route("/stats", methods=["GET"])
def public_stats():
    from app.models.product import Product
    from app.models.supplier import Supplier
    from app.models.category import Category
    return jsonify({
        "products": Product.query.count(),
        "suppliers": Supplier.query.count(),
        "categories": Category.query.count(),
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Successfully logged out"}), 200
