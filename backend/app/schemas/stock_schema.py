from marshmallow import Schema, fields, validate

class StockSchema(Schema):
    id = fields.Int(dump_only=True)

    product_id = fields.Int(required=True)
    user_id = fields.Int(required=True)

    quantity = fields.Int(
        required=True,
        validate=validate.Range(min=1)
    )

    type = fields.Str(
        required=True,
        validate=validate.OneOf(["IN", "OUT"])
    )

    reference = fields.Str()

    created_at = fields.DateTime(dump_only=True)