import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CategoryForm from "../../components/CategoryForm";
import { useCategory } from "../../hooks/useCategory";

const adminLinks = [
  { to: "/dashboard/admin", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/admin/users", icon: "👥", label: "Users" },
  { to: "/dashboard/admin/products", icon: "📦", label: "Products" },
  { to: "/dashboard/admin/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/admin/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/admin/inventory", icon: "📊", label: "Inventory" },
];

export default function AdminCategories() {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();

  // Initialize editCat with current category values
  const [editCat, setEditCat] = useState({});

  const getVal = (c, field) =>
    editCat[c.id]?.[field] !== undefined
      ? editCat[c.id][field]
      : (c[field] ?? "");

  const handleCatChange = (id, field, value) => {
    setEditCat((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = (c) => {
    updateCategory(c.id, {
      name: getVal(c, "name"),
      description: getVal(c, "description"),
    });
  };

  return (
    <DashboardLayout navLinks={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-400 text-sm mt-1">
          {categories.length} categories
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          ➕ Add Category
        </h2>
        <CategoryForm onSuccess={fetchCategories} addCategory={addCategory} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Name", "Description", "Actions"].map((h) => (
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
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <input
                    value={getVal(c, "name")}
                    onChange={(e) =>
                      handleCatChange(c.id, "name", e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-green-400"
                  />
                </td>
                <td className="px-6 py-3">
                  <input
                    value={getVal(c, "description")}
                    onChange={(e) =>
                      handleCatChange(c.id, "description", e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-green-400"
                  />
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(c)}
                      className="text-xs px-3 py-1.5 bg-green-50 border border-green-200 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
