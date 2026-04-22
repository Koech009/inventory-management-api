from marshmallow import Schema, fields, validate

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)

    name = fields.Str(required=True)

    price = fields.Float(
        required=True,
        validate=validate.Range(min=0.01)
    )

    stock_quantity = fields.Int(
        required=True,
        validate=validate.Range(min=0)
    )

    category_id = fields.Int(required=True)
    supplier_id = fields.Int(required=True)