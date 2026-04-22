// src/pages/DashboardManager.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import CategoryForm from "../components/CategoryForm";
import SupplierForm from "../components/SupplierForm";
import SupplierCard from "../components/SupplierCard";
import InventoryTracking from "../components/InventoryTracking";

import { useProducts } from "../hooks/useProducts";
import { useCategory } from "../hooks/useCategory";
import { useSuppliers } from "../hooks/useSuppliers";
import { useInventory } from "../hooks/useInventory";

export default function DashboardManager() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();
  const {
    suppliers,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();
  const {
    transactions,
    fetchInventory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useInventory();

  // Local edit state for categories
  const [editCat, setEditCat] = useState({});

  const handleCatChange = (id, field, value) => {
    setEditCat((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleCatSave = (c) => {
    const updated = { ...c, ...editCat[c.id] };
    updateCategory(c.id, updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Manager Dashboard
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Manage products, categories, suppliers and inventory
        </p>

        {/* ── Products ── */}
        <section className="mb-10 bg-blue-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center border-b border-blue-200 pb-2">
            Products
          </h2>
          <ProductForm onSuccess={fetchProducts} addProduct={addProduct} />
          <div className="mt-4 divide-y divide-blue-200 border border-blue-200 rounded">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onUpdated={fetchProducts}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="mb-10 bg-green-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-green-700 mb-4 text-center border-b border-green-200 pb-2">
            Categories
          </h2>
          <CategoryForm onSuccess={fetchCategories} addCategory={addCategory} />
          <table className="w-full mt-4 border-collapse border border-green-200">
            <thead>
              <tr className="bg-green-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      defaultValue={c.name}
                      onChange={(e) =>
                        handleCatChange(c.id, "name", e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      defaultValue={c.description}
                      onChange={(e) =>
                        handleCatChange(c.id, "description", e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCatSave(c)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── Suppliers ── */}
        <section className="mb-10 bg-indigo-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center border-b border-indigo-200 pb-2">
            Suppliers
          </h2>
          <SupplierForm onSuccess={fetchSuppliers} addSupplier={addSupplier} />
          <div className="mt-4 divide-y divide-indigo-200 border border-indigo-200 rounded">
            {suppliers.map((s) => (
              <SupplierCard
                key={s.id}
                supplier={s}
                onUpdated={fetchSuppliers}
                updateSupplier={updateSupplier}
                deleteSupplier={deleteSupplier}
              />
            ))}
          </div>
        </section>

        {/* ── Inventory ── */}
        <section className="bg-purple-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-purple-700 mb-4 text-center border-b border-purple-200 pb-2">
            Inventory Tracking
          </h2>
          <InventoryTracking
            transactions={transactions}
            onUpdated={fetchInventory}
            addTransaction={addTransaction}
            updateTransaction={updateTransaction}
            deleteTransaction={deleteTransaction}
          />
        </section>
      </div>
    </div>
  );
}
