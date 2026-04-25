from marshmallow import Schema, fields, validate, ValidationError, validates


class UserSchema(Schema):
    id = fields.Int(dump_only=True)

    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=80),
        error_messages={"required": "Username is required."}
    )

    email = fields.Email(
        required=True,
        error_messages={
            "required": "Email is required.",
            "invalid": "Invalid email format."
        }
    )

    role = fields.Str(
        validate=validate.OneOf(["admin", "manager", "staff"]),
        load_default="staff"
    )

    password = fields.Str(
        required=True,
        validate=validate.Length(min=6),
        load_only=True,
        error_messages={"required": "Password is required."}
    )

    @validates("username")
    def validate_username(self, value):
        if not value.isalnum():
            raise ValidationError("Username must be alphanumeric only.")

    @validates("email")
    def validate_email(self, value):
        if "@" not in value:
            raise ValidationError("Email must contain '@'.")
