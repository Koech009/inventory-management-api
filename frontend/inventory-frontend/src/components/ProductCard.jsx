import { useState } from "react";
import API from "../api/axios";
import ProductForm from "./ProductForm";
import { useAuthContext } from "../contexts/AuthContext";

export default function ProductCard({ product, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const { user } = useAuthContext();

  const canEdit =
    user?.role === "admin" ||
    user?.role === "manager" ||
    product.created_by === user?.id;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await API.delete(`/products/${product.id}`);
      onDeleted?.(product.id);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleUpdateSuccess = () => {
    setEditing(false);
    onUpdated?.();
  };

  if (editing) {
    return (
      <tr>
        <td colSpan={7} className="px-6 py-4 bg-gray-50">
          <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-green-50 border-b border-green-100">
              <div className="flex items-center gap-2">
                <span className="text-base">✏️</span>
                <h3 className="text-sm font-semibold text-gray-700">
                  Editing:{" "}
                  <span className="text-green-600">{product.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 rounded-lg transition-colors font-medium"
              >
                ✕ Cancel
              </button>
            </div>
            <div className="px-6 py-5">
              <ProductForm product={product} onSuccess={handleUpdateSuccess} />
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        {product.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-[180px] truncate">
        {product.description || "—"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">
        ${Number(product.price).toFixed(2)}
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            product.quantity === 0
              ? "bg-red-100 text-red-600"
              : product.quantity < 10
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
          }`}
        >
          {product.quantity}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {product.category?.name ||
          (product.category_id ? `#${product.category_id}` : "—")}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {product.supplier?.name ||
          (product.supplier_id ? `#${product.supplier_id}` : "—")}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          {canEdit ? (
            <>
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
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">View only</span>
          )}
        </div>
      </td>
    </tr>
  );
}
