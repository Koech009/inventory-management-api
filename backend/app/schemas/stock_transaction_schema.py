from marshmallow import Schema, fields, validate


class StockTransactionSchema(Schema):
    id = fields.Int(dump_only=True)

    product_id = fields.Int(required=True)
    user_id = fields.Int(dump_only=True)

    # ✅ FIXED: Proper Enum serialization/deserialization
    movement_type = fields.Function(
        serialize=lambda obj: obj.movement_type.value,
        deserialize=lambda value: value.lower(),
        required=True
    )

    quantity = fields.Int(
        required=True,
        validate=validate.Range(min=1)
    )

    notes = fields.Str(load_default=None)
    reference = fields.Str(load_default=None)

    # ✅ REAL stored value now (not injected)
    stock_level = fields.Int(dump_only=True)

    created_at = fields.DateTime(dump_only=True)

    is_deleted = fields.Bool(dump_only=True)
    deleted_at = fields.DateTime(dump_only=True)
