// src/pages/DashboardStaff.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function DashboardStaff() {
  const {
    products,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [editProduct, setEditProduct] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Add, edit, and delete products.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Product Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5">
            {editProduct ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <ProductForm
            onSuccess={() => {
              fetchProducts();
              setEditProduct(null);
            }}
            addProduct={addProduct}
            editProduct={editProduct}
            updateProduct={updateProduct}
          />
          {editProduct && (
            <button
              onClick={() => setEditProduct(null)}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-16 text-center">
            <p className="text-gray-400 text-sm">
              No products yet. Add one above.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                All Products
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {products.length} item{products.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      "Name",
                      "Description",
                      "Price",
                      "Quantity",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onEdit={setEditProduct}
                      onUpdated={fetchProducts}
                      updateProduct={updateProduct}
                      deleteProduct={deleteProduct}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
