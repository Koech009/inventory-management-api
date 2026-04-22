import { useState } from "react";
import API from "../api/axios";

export default function SupplierForm({ onSuccess, supplier }) {
  const [form, setForm] = useState({
    name: supplier?.name || "",
    contact_email: supplier?.contact_email || "",
    phone: supplier?.phone || "",
    address: supplier?.address || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Supplier name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        if (value.trim().length > 100) return "Name must be under 100 characters.";
        if (!/^[a-zA-Z0-9\s\-_().&]+$/.test(value))
          return "Name contains invalid characters.";
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
      {}
    );
    setTouched(allTouched);
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      if (supplier) {
        await API.put(`/suppliers/${supplier.id}`, form);
      } else {
        await API.post("/suppliers", form);
        setForm({ name: "", contact_email: "", phone: "", address: "" });
        setTouched({});
        setErrors({});
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError("Error saving supplier. Please try again.");
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
          placeholder="e.g. Acme Supplies"
          className={inputClass("name")}
        />
        <FieldError field="name" />
        <FieldSuccess field="name" />
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
        <FieldSuccess field="contact_email" />
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
          <FieldSuccess field="phone" />
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
          <FieldSuccess field="address" />
        </div>
      </div>

      {/* Address character count */}
      {form.address.length > 0 && (
        <p
          className={`-mt-2 text-xs text-right ${
            form.address.length > 180 ? "text-red-400" : "text-gray-400"
          }`}
        >
          {form.address.length}/200
        </p>
      )}

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
          : supplier
            ? "✅ Update Supplier"
            : "➕ Add Supplier"}
      </button>
    </form>
  );
}