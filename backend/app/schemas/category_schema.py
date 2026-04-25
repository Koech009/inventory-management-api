from marshmallow import Schema, fields

class CategorySchema(Schema):
    id = fields.Int(dump_only=True)

    name = fields.Str(
        required=True,
        error_messages={"required": "Category name is required"}
    )