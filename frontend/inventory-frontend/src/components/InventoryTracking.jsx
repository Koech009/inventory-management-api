import { useState, useEffect } from "react";
import API from "../api/axios";

export default function InventoryTracking({
  transactions = [],
  products = [],
  onUpdated,
  allowedTypes = ["in", "out"],
  onDelete = null,
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    product_id: "",
    movement_type: "in",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    if (products.length > 0) {
      setFormData((prev) => ({
        ...prev,
        product_id: Number(products[0].id),
      }));
    }
  }, [products]);

  const isInbound = (type) => String(type).toLowerCase().includes("in");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_id" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.product_id) {
      setError("Please select a product");
      return;
    }

    try {
      await API.post("/inventory", {
        product_id: Number(formData.product_id),
        movement_type: formData.movement_type.toLowerCase(),
        quantity: Number(formData.quantity),
        notes: formData.notes || null,
      });

      setFormData({
        product_id: products[0] ? Number(products[0].id) : "",
        movement_type: "in",
        quantity: 1,
        notes: "",
      });

      setShowForm(false);
      onUpdated?.();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to save transaction.");
    }
  };

  const stockBadge = (level) => {
    if (level == null) return <span className="text-gray-400">—</span>;

    if (level === 0) {
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
          0 — out
        </span>
      );
    }

    if (level <= 10) {
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
          {level} — low
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
        {level}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-sm font-semibold text-gray-700">Inventory</h2>

        <button
          onClick={() => {
            setShowForm((p) => !p);
            setError("");
          }}
          className="px-4 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 bg-gray-50 border-b space-y-4"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700">Product</label>

            {products.length === 0 ? (
              <p className="text-sm text-red-500">No products available.</p>
            ) : (
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full mt-1 border px-3 py-2 rounded text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.name} (Stock: {p.quantity ?? "?"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700">Movement Type</label>

            <select
              name="movement_type"
              value={formData.movement_type}
              onChange={handleChange}
              className="w-full mt-1 border px-3 py-2 rounded text-sm"
            >
              {allowedTypes.includes("in") && (
                <option value="in">In (Add)</option>
              )}
              {allowedTypes.includes("out") && (
                <option value="out">Out (Remove)</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700">Quantity</label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={1}
              className="w-full mt-1 border px-3 py-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Notes</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full mt-1 border px-3 py-2 rounded text-sm"
              placeholder="Optional..."
            />
          </div>

          <button
            type="submit"
            disabled={products.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            Save Transaction
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "Product",
                "Movement",
                "Qty",
                "Stock",
                "Notes",
                "Date",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-xs text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className={
                    t.is_deleted ? "opacity-50 bg-gray-50" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 text-sm">
                    {products.find((p) => p.id === t.product_id)?.name ||
                      `#${t.product_id}`}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        isInbound(t.movement_type)
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isInbound(t.movement_type) ? "In" : "Out"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">{t.quantity}</td>

                  <td className="px-6 py-4 text-sm">
                    {stockBadge(t.stock_level)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-400 italic">
                    {t.notes || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    {t.is_deleted ? (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded">
                        Deleted
                      </span>
                    ) : onDelete ? (
                      <button
                        onClick={() => onDelete(t.id)}
                        className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
