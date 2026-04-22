import { useState } from "react";
import API from "../api/axios";

export default function SupplierCard({ supplier, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: supplier.name || "",
    contact_email: supplier.contact_email || "",
    phone: supplier.phone || "",
    address: supplier.address || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Supplier name is required.";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters.";
        if (value.trim().length > 100)
          return "Name must be under 100 characters.";
        return null;

      case "contact_email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address.";
        return null;

      case "phone":
        if (value && !/^[\d\s\+\-\(\)]{7,20}$/.test(value))
          return "Enter a valid phone number.";
        return null;

      case "address":
        if (value && value.length > 200)
          return "Address must be under 200 characters.";
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
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err || undefined }));
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete supplier "${supplier.name}"?`)) return;
    try {
      await API.delete(`/suppliers/${supplier.id}`);
      onDeleted?.(supplier.id);
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  const handleUpdate = async () => {
    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await API.put(`/suppliers/${supplier.id}`, { ...supplier, ...form });
      setEditing(false);
      onUpdated?.();
    } catch (err) {
      console.error("Error updating supplier:", err);
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

  if (editing) {
    return (
      <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden mb-4">
        {/* Edit Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-2">
            <span className="text-base">✏️</span>
            <h3 className="text-sm font-semibold text-gray-700">
              Editing: <span className="text-green-600">{supplier.name}</span>
            </h3>
          </div>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 rounded-lg transition-colors font-medium"
          >
            ✕ Cancel
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
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
              placeholder="e.g. Acme Supplies"
              className={inputClass("name")}
            />
            <FieldError field="name" />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              Contact Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="contact_email"
              value={form.contact_email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. contact@supplier.com"
              className={inputClass("contact_email")}
            />
            <FieldError field="contact_email" />
          </div>

          {/* Phone + Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Phone{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. +254 700 000 000"
                className={inputClass("phone")}
              />
              <FieldError field="phone" />
            </div>
            <div>
              <label className={labelClass}>
                Address{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Nairobi, Kenya"
                className={inputClass("address")}
              />
              <FieldError field="address" />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            <span className="text-red-400">*</span> Required fields
          </p>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors"
          >
            {loading ? "Saving..." : "✅ Update Supplier"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="px-6 py-4 flex justify-between items-start">
        {/* Supplier Info */}
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-gray-800">
            {supplier.name}
          </h4>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            📧 {supplier.contact_email}
          </p>
          {supplier.phone && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              📞 {supplier.phone}
            </p>
          )}
          {supplier.address && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              📍 {supplier.address}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => setEditing(true)}
            className="text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 rounded-md transition-colors font-medium"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-md transition-colors font-medium"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
