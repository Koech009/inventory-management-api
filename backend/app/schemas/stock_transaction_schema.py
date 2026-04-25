from marshmallow import Schema, fields, validate


class StockTransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    product_id = fields.Int(required=True)
    user_id = fields.Int(dump_only=True)
    type = fields.Str(required=True, validate=validate.OneOf(["in", "out"]))
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    movement_type = fields.Str(
        required=True,
        validate=validate.OneOf([
            "purchase", "restock", "initial_load",
            "sale", "usage", "disposal"
        ])
    )
    #
    date = fields.DateTime(required=False)
    notes = fields.Str()
