import { useState, useEffect } from "react";
import API from "../api/axios";

export default function InventoryTracking({
  transactions,
  onUpdated,
  products = [],
  allowedTypes = ["in", "out"],
  allowedMovements = null,
  allowDelete = true,
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    type: "in",
    movement_type: "restock",
    quantity: 1,
  });
  const [error, setError] = useState("");

  // Set product_id once products load
  useEffect(() => {
    if (products.length > 0 && !formData.product_id) {
      setFormData((prev) => ({
        ...prev,
        product_id: parseInt(products[0].id, 10),
      }));
    }
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_id"
          ? parseInt(value, 10)
          : name === "quantity"
            ? parseInt(value, 10)
            : value,
      ...(name === "type" && {
        movement_type: value === "in" ? "restock" : "sale",
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      product_id: parseInt(formData.product_id, 10),
      type: formData.type,
      movement_type: formData.movement_type,
      quantity: parseInt(formData.quantity, 10),
      date: new Date().toISOString(),
    };
    try {
      await API.post("/inventory", payload);
      setShowForm(false);
      setFormData({
        product_id: products[0] ? parseInt(products[0].id, 10) : "",
        type: "in",
        movement_type: "restock",
        quantity: 1,
      });
      onUpdated?.();
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Failed to save transaction.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/inventory/${id}`);
      onUpdated?.();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction.");
    }
  };

  const movementOptions = {
    in: ["purchase", "restock", "initial_load"],
    out: ["sale", "usage", "disposal"],
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Inventory</h2>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setError("");
          }}
          className="text-xs px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 border-b border-gray-100 bg-gray-50 space-y-4"
        >
          {error && (
            <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product
            </label>
            {products.length === 0 ? (
              <p className="mt-1 text-sm text-red-500">
                No products available. Please add a product first.
              </p>
            ) : (
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {allowedTypes.includes("in") && <option value="in">In</option>}
              {allowedTypes.includes("out") && <option value="out">Out</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Movement Type
            </label>
            <select
              name="movement_type"
              value={formData.movement_type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {movementOptions[formData.type]
                .filter(
                  (m) => !allowedMovements || allowedMovements.includes(m),
                )
                .map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1).replace("_", " ")}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min={1}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={products.length === 0}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Save Transaction
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {[
                "Product",
                "Type",
                "Movement",
                "Quantity",
                "Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  No transactions yet. Add one above.
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const product = products.find((p) => p.id === t.product_id);
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {product ? product.name : `Product #${t.product_id}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.movement_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.date ? new Date(t.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {allowDelete && (
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
