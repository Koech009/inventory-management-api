from marshmallow import Schema, fields

class SupplierSchema(Schema):
    id = fields.Int(dump_only=True)

    name = fields.Str(
        required=True,
        error_messages={"required": "Supplier name is required"}
    )

    contact_info = fields.Str()