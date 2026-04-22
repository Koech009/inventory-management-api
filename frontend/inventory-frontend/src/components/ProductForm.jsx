import { useState, useEffect } from "react";
import API from "../api/axios";

export default function ProductForm({ onSuccess, product }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    quantity: product?.quantity || "",
    category_id: product?.category_id || "",
    supplier_id: product?.supplier_id || "",
  });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, supRes] = await Promise.all([
          API.get("/categories"),
          API.get("/suppliers"),
        ]);
        setCategories(catRes.data);
        setSuppliers(supRes.data);
      } catch (err) {
        console.error("Error fetching categories/suppliers:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
        category_id: product.category_id || "",
        supplier_id: product.supplier_id || "",
      });
      setErrors({});
      setTouched({});
    }
  }, [product?.id]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Product name is required.";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters.";
        if (value.trim().length > 100)
          return "Name must be under 100 characters.";
        if (!/^[a-zA-Z0-9\s\-_().]+$/.test(value))
          return "Name contains invalid characters.";
        return null;

      case "description":
        if (value && value.length > 300)
          return "Description must be under 300 characters.";
        return null;

      case "price":
        if (value === "" || value === null) return "Price is required.";
        if (isNaN(value)) return "Price must be a number.";
        if (Number(value) <= 0) return "Price must be greater than 0.";
        if (Number(value) > 10000000)
          return "Price seems unrealistically high.";
        if (!/^\d+(\.\d{1,2})?$/.test(String(value)))
          return "Price can have at most 2 decimal places.";
        return null;

      case "quantity":
        if (value === "" || value === null) return "Quantity is required.";
        if (!Number.isInteger(Number(value)))
          return "Quantity must be a whole number.";
        if (Number(value) < 0) return "Quantity cannot be negative.";
        if (Number(value) > 1000000)
          return "Quantity seems unrealistically high.";
        return null;

      case "category_id":
        if (!value) return "Please select a category.";
        return null;

      case "supplier_id":
        if (!value) return "Please select a supplier.";
        return null;

      default:
        return null;
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Live re-validate if field was already touched
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err || undefined }));
    }
    setSubmitError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err || undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields touched so errors show everywhere
    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      if (product) {
        await API.put(`/products/${product.id}`, form);
      } else {
        await API.post("/products", form);
        setForm({
          name: "",
          description: "",
          price: "",
          quantity: "",
          category_id: "",
          supplier_id: "",
        });
        setTouched({});
        setErrors({});
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError("Error saving product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none transition-colors bg-white";
  const inputClass = (field) =>
    `${inputBase} ${
      errors[field] && touched[field]
        ? "border-red-400 focus:border-red-500 bg-red-50"
        : touched[field] && !errors[field]
          ? "border-green-400 focus:border-green-500"
          : "border-gray-200 focus:border-green-500"
    }`;
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  const errorClass = "mt-1 text-xs text-red-500 flex items-center gap-1";

  const FieldError = ({ field }) =>
    errors[field] && touched[field] ? (
      <p className={errorClass}>
        <span>⚠</span> {errors[field]}
      </p>
    ) : null;

  const FieldSuccess = ({ field }) =>
    !errors[field] && touched[field] && form[field] !== "" ? (
      <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
        <span>✓</span> Looks good
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Submit-level error */}
      {submitError && (
        <div className="px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-500 text-sm flex items-center gap-2">
          <span>❌</span> {submitError}
        </div>
      )}

      {/* Name */}
      <div>
        <label className={labelClass}>
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. HP Laptop Pro"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClass("name")}
        />
        <FieldError field="name" />
        <FieldSuccess field="name" />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="description"
          placeholder="Short description of the product..."
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={2}
          className={`${inputClass("description")} resize-none`}
        />
        <div className="flex items-center justify-between">
          <FieldError field="description" />
          <p
            className={`text-xs mt-1 ml-auto ${
              form.description.length > 280 ? "text-red-400" : "text-gray-400"
            }`}
          >
            {form.description.length}/300
          </p>
        </div>
      </div>

      {/* Price + Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Price ($) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="price"
            placeholder="0.00"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            step="0.01"
            className={inputClass("price")}
          />
          <FieldError field="price" />
          <FieldSuccess field="price" />
        </div>
        <div>
          <label className={labelClass}>
            Quantity <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="0"
            value={form.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            step="1"
            className={inputClass("quantity")}
          />
          <FieldError field="quantity" />
          <FieldSuccess field="quantity" />
        </div>
      </div>

      {/* Category + Supplier */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Category <span className="text-red-400">*</span>
          </label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("category_id")}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <FieldError field="category_id" />
          <FieldSuccess field="category_id" />
        </div>
        <div>
          <label className={labelClass}>
            Supplier <span className="text-red-400">*</span>
          </label>
          <select
            name="supplier_id"
            value={form.supplier_id}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("supplier_id")}
          >
            <option value="">Select supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <FieldError field="supplier_id" />
          <FieldSuccess field="supplier_id" />
        </div>
      </div>

      {/* Required note */}
      <p className="text-xs text-gray-400">
        <span className="text-red-400">*</span> Required fields
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors"
      >
        {loading
          ? "Saving..."
          : product
            ? "✅ Update Product"
            : "➕ Add Product"}
      </button>
    </form>
  );
}
