import DashboardLayout from "../../layouts/DashboardLayout";
import { useCategory } from "../../hooks/useCategory";

const managerLinks = [
  { to: "/dashboard/manager", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/manager/products", icon: "📦", label: "Products" },
  { to: "/dashboard/manager/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/manager/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/manager/inventory", icon: "📊", label: "Inventory" },
];

export default function ManagerCategories() {
  const { categories, fetchCategories } = useCategory();

  return (
    <DashboardLayout navLinks={managerLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-400 text-sm mt-1">
          {categories.length} categories
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{c.name}</td>
                <td className="px-6 py-3">{c.description}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
