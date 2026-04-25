import DashboardLayout from "../../layouts/DashboardLayout";
import { useSuppliers } from "../../hooks/useSuppliers";

const managerLinks = [
  { to: "/dashboard/manager", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/manager/products", icon: "📦", label: "Products" },
  { to: "/dashboard/manager/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/manager/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/manager/inventory", icon: "📊", label: "Inventory" },
];

export default function ManagerSuppliers() {
  const { suppliers } = useSuppliers();

  return (
    <DashboardLayout navLinks={managerLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <p className="text-gray-400 text-sm mt-1">
          {suppliers.length} suppliers
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Name", "Email", "Phone", "Address"].map((h) => (
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
            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  No suppliers available.
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{s.name}</td>
                  <td className="px-6 py-3">{s.contact_email}</td>
                  <td className="px-6 py-3">{s.phone}</td>
                  <td className="px-6 py-3">{s.address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
