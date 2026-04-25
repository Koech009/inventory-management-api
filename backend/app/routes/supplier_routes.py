from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.supplier import Supplier
from app.schemas.supplier_schema import SupplierSchema
from flask_jwt_extended import jwt_required

supplier_bp = Blueprint("suppliers", __name__, url_prefix="/suppliers")

supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)


@supplier_bp.route("", methods=["POST"])
@jwt_required()
def create_supplier():
    """
    Create a new supplier.
    Validates the request data against the SupplierSchema,
    checks for duplicate name and email, and persists the supplier.
    Returns the created supplier with a 201 status code.
    """
    data = request.get_json()

    errors = supplier_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    if Supplier.query.filter_by(name=data["name"]).first():
        return jsonify({"error": "Supplier name already exists"}), 400

    if Supplier.query.filter_by(contact_email=data["contact_email"]).first():
        return jsonify({"error": "Supplier email already exists"}), 400

    supplier = Supplier(
        name=data["name"],
        contact_email=data["contact_email"],
        phone=data.get("phone"),
        address=data.get("address"),
    )
    db.session.add(supplier)
    db.session.commit()

    return jsonify(supplier_schema.dump(supplier)), 201


@supplier_bp.route("", methods=["GET"])
@jwt_required()
def get_suppliers():
    """
    Retrieve a paginated list of all suppliers.
    Supports `page` and `per_page` query parameters (max 100 per page).
    Returns suppliers list along with pagination metadata.
    """
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 100, type=int), 100)

    pagination = Supplier.query.order_by(Supplier.id.asc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "suppliers": suppliers_schema.dump(pagination.items),
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


@supplier_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_supplier(id):
    """
    Retrieve a single supplier by its ID.
    Returns 404 if the supplier does not exist.
    """
    supplier = db.session.get(Supplier, id)
    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404
    return jsonify(supplier_schema.dump(supplier)), 200


@supplier_bp.route("/<int:id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_supplier(id):
    """
    Update an existing supplier by its ID.
    Supports partial updates (PATCH). Validates the incoming data,
    checks for duplicate name and email conflicts, and saves changes.
    Returns 404 if the supplier does not exist.
    """
    supplier = db.session.get(Supplier, id)
    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404

    data = request.get_json()

    errors = supplier_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400

    if "name" in data:
        existing = Supplier.query.filter_by(name=data["name"]).first()
        if existing and existing.id != supplier.id:
            return jsonify({"error": "Supplier name already exists"}), 400

    if "contact_email" in data:
        existing = Supplier.query.filter_by(
            contact_email=data["contact_email"]).first()
        if existing and existing.id != supplier.id:
            return jsonify({"error": "Supplier email already exists"}), 400

    supplier.name = data.get("name", supplier.name)
    supplier.contact_email = data.get("contact_email", supplier.contact_email)
    supplier.phone = data.get("phone", supplier.phone)
    supplier.address = data.get("address", supplier.address)

    db.session.commit()
    return jsonify(supplier_schema.dump(supplier)), 200


@supplier_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_supplier(id):
    """
    Delete a supplier by its ID.
    Returns 404 if the supplier does not exist.
    Returns 204 No Content on successful deletion.
    """
    supplier = db.session.get(Supplier, id)
    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404

    db.session.delete(supplier)
    db.session.commit()
    return "", 204
