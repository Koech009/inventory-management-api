from marshmallow import Schema, fields, validate


class SupplierSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120),
        error_messages={"required": "Supplier name is required."}
    )
    contact_email = fields.Email(
        required=True,
        error_messages={
            "required": "Contact email is required.",
            "invalid": "Invalid email format."
        }
    )
    phone = fields.Str(validate=validate.Length(min=7, max=20))
    address = fields.Str(validate=validate.Length(max=200))
