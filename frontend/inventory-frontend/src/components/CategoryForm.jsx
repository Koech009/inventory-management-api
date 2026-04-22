import { useState } from "react";
import API from "../api/axios";

export default function CategoryForm({ onSuccess, category }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Category name is required.";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters.";
        if (value.trim().length > 50)
          return "Name must be under 50 characters.";
        if (!/^[a-zA-Z0-9\s\-_().&]+$/.test(value))
          return "Name contains invalid characters.";
        return null;

      case "description":
        if (value && value.length > 300)
          return "Description must be under 300 characters.";
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
      if (category) {
        await API.put(`/categories/${category.id}`, form);
      } else {
        await API.post("/categories", form);
        setForm({ name: "", description: "" });
        setTouched({});
        setErrors({});
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError("Error saving category. Please try again.");
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

  const FieldError = ({ field }) =>
    errors[field] && touched[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
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
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Electronics"
          className={inputClass("name")}
        />
        <div className="flex items-center justify-between">
          <FieldError field="name" />
          <p
            className={`text-xs mt-1 ml-auto ${
              form.name.length > 40 ? "text-red-400" : "text-gray-400"
            }`}
          >
            {form.name.length}/50
          </p>
        </div>
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
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Brief description of this category..."
          rows={3}
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
        <FieldSuccess field="description" />
      </div>

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
          : category
            ? "✅ Update Category"
            : "➕ Add Category"}
      </button>
    </form>
  );
}
