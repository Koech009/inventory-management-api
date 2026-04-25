from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.category import Category
from app.schemas.category_schema import CategorySchema
from flask_jwt_extended import jwt_required

category_bp = Blueprint("categories", __name__, url_prefix="/categories")

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


@category_bp.route("", methods=["POST"])
@jwt_required()
def create_category():
    """
    Create a new category.
    Validates the request data against the CategorySchema,
    checks for duplicate names, and persists the new category to the database.
    Returns the created category with a 201 status code.
    """
    data = request.get_json()

    errors = category_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    if Category.query.filter_by(name=data["name"]).first():
        return jsonify({"error": "Category name already exists"}), 400

    category = Category(
        name=data["name"],
        description=data.get("description")
    )
    db.session.add(category)
    db.session.commit()

    return jsonify(category_schema.dump(category)), 201


@category_bp.route("", methods=["GET"])
@jwt_required()
def get_categories():
    """
    Retrieve a paginated list of all categories.
    Supports `page` and `per_page` query parameters (max 100 per page).
    Returns the categories list along with pagination metadata.
    """
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 100, type=int), 100)

    pagination = Category.query.order_by(Category.id.asc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "categories": categories_schema.dump(pagination.items),
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


@category_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_category(id):
    """
    Retrieve a single category by its ID.
    Returns 404 if the category does not exist.
    """
    category = db.session.get(Category, id)
    if not category:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(category_schema.dump(category)), 200


@category_bp.route("/<int:id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_category(id):
    """
    Update an existing category by its ID.
    Supports partial updates (PATCH). Validates the incoming data,
    checks for duplicate names, and saves changes to the database.
    Returns 404 if the category does not exist.
    """
    category = db.session.get(Category, id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json()

    errors = category_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400

    if "name" in data:
        existing = Category.query.filter_by(name=data["name"]).first()
        if existing and existing.id != category.id:
            return jsonify({"error": "Category name already exists"}), 400

    category.name = data.get("name", category.name)
    category.description = data.get("description", category.description)
    db.session.commit()

    return jsonify(category_schema.dump(category)), 200


@category_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    """
    Delete a category by its ID.
    Returns 404 if the category does not exist.
    Returns 204 No Content on successful deletion.
    """
    category = db.session.get(Category, id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return "", 204
