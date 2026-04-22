// src/pages/DashboardAdmin.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import CategoryForm from "../components/CategoryForm";
import SupplierForm from "../components/SupplierForm";
import SupplierCard from "../components/SupplierCard";
import InventoryTracking from "../components/InventoryTracking";

import useUsers from "../hooks/useUsers";
import { useProducts } from "../hooks/useProducts";
import { useCategory } from "../hooks/useCategory";
import { useSuppliers } from "../hooks/useSuppliers";
import { useInventory } from "../hooks/useInventory";

export default function DashboardAdmin() {
  const { users, error: userError, deleteUser, updateUserRole } = useUsers();
  const {
    products,
    error: productError,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const {
    categories,
    error: categoryError,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();
  const {
    suppliers,
    error: supplierError,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();
  const {
    transactions,
    error: inventoryError,
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
    updateCategory(c.id, { ...c, ...editCat[c.id] });
  };

  const anyError =
    userError ||
    productError ||
    categoryError ||
    supplierError ||
    inventoryError;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Full access — manage users, products, categories, suppliers,
            inventory
          </p>
        </div>

        {/* Error Banner */}
        {anyError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-500 text-sm">
            {anyError}
          </div>
        )}

        {/* ── Users ── */}
        <section className="mb-10 bg-yellow-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-yellow-700 mb-4 text-center border-b border-yellow-200 pb-2">
            Users
          </h2>
          {users.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
              No users found.
            </p>
          ) : (
            <table className="w-full border-collapse border border-yellow-200">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-yellow-50">
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ── Products ── */}
        <section className="mb-10 bg-blue-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center border-b border-blue-200 pb-2">
            Products
          </h2>
          <ProductForm onSuccess={fetchProducts} addProduct={addProduct} />
          <div className="mt-4 divide-y divide-blue-200 border border-blue-200 rounded">
            {products.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">
                No products yet.
              </p>
            ) : (
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onUpdated={fetchProducts}
                  updateProduct={updateProduct}
                  deleteProduct={deleteProduct}
                />
              ))
            )}
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
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-400 text-sm py-4"
                  >
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-green-50">
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
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => deleteCategory(c.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
            {suppliers.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">
                No suppliers yet.
              </p>
            ) : (
              suppliers.map((s) => (
                <SupplierCard
                  key={s.id}
                  supplier={s}
                  onUpdated={fetchSuppliers}
                  updateSupplier={updateSupplier}
                  deleteSupplier={deleteSupplier}
                />
              ))
            )}
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
