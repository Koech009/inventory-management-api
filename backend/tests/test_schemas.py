import pytest
from marshmallow import ValidationError
from app.schemas.category_schema import CategorySchema
from app.models.category import Category


def test_category_schema_valid():
    schema = CategorySchema()
    data = {"name": "Electronics", "description": "All gadgets"}
    result = schema.load(data)
    assert result["name"] == "Electronics"
    assert result["description"] == "All gadgets"


def test_category_schema_missing_name():
    schema = CategorySchema()
    with pytest.raises(ValidationError) as excinfo:
        schema.load({"description": "No name provided"})
    assert "Category name is required." in str(excinfo.value)


def test_category_schema_name_too_short():
    schema = CategorySchema()
    with pytest.raises(ValidationError):
        schema.load({"name": "A"})


def test_category_schema_name_too_long():
    schema = CategorySchema()
    with pytest.raises(ValidationError):
        schema.load({"name": "X" * 200})


def test_category_schema_dump():
    schema = CategorySchema()
    category = Category(name="Books", description="All kinds of books")
    result = schema.dump(category)
    assert result["name"] == "Books"
    assert result["description"] == "All kinds of books"
