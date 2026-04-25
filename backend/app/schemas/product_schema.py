from marshmallow import Schema, fields, validate


class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120),
        error_messages={"required": "Product name is required."}
    )
    description = fields.Str()
    price = fields.Float(
        required=True,
        validate=validate.Range(min=0),
        error_messages={"required": "Price is required."}
    )
    quantity = fields.Int(
        validate=validate.Range(min=0),
        load_default=0
    )
    category_id = fields.Int(load_only=True)
    supplier_id = fields.Int(load_only=True)
    created_by = fields.Int(dump_only=True)

    category = fields.Method("get_category", dump_only=True)
    supplier = fields.Method("get_supplier", dump_only=True)

    def get_category(self, obj):
        if obj.category:
            return {"id": obj.category.id, "name": obj.category.name}
        return None

    def get_supplier(self, obj):
        if obj.supplier:
            return {"id": obj.supplier.id, "name": obj.supplier.name}
        return None
