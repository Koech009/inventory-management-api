import { useState, useEffect } from "react";
import API from "../api/axios";

export default function InventoryTracking({ transactions, onUpdated }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    type: "restock",
    quantity: 0,
    date: new Date().toISOString().slice(0, 10),
    user_id: 1,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Record transaction
      await API.post("/inventory", formData);

      // Update product quantity automatically
      const productRes = await API.get(`/products/${formData.product_id}`);
      const product = productRes.data;
      const newQty =
        formData.type === "restock"
          ? product.quantity + Number(formData.quantity)
          : product.quantity - Number(formData.quantity);

      await API.put(`/products/${formData.product_id}`, {
        ...product,
        quantity: newQty,
      });

      setShowForm(false);
      setFormData({
        product_id: "",
        type: "restock",
        quantity: 0,
        date: new Date().toISOString().slice(0, 10),
        user_id: 1,
      });
      onUpdated?.(); // refresh parent dashboard
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Inventory</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
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
              Product ID
            </label>
            <input
              type="number"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="restock">Restock</option>
              <option value="sale">Sale</option>
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Save Transaction
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">
                  Product #{t.product_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.type}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {t.type === "restock" ? "+" : "-"}
                  {t.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  No transactions yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
