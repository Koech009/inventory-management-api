from marshmallow import Schema, fields, validate


class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120),
        error_messages={"required": "Category name is required."}
    )
    description = fields.Str()
