import DashboardLayout from "../../layouts/DashboardLayout";
import SupplierForm from "../../components/SupplierForm";
import SupplierCard from "../../components/SupplierCard";
import { useSuppliers } from "../../hooks/useSuppliers";

const adminLinks = [
  { to: "/dashboard/admin", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/admin/users", icon: "👥", label: "Users" },
  { to: "/dashboard/admin/products", icon: "📦", label: "Products" },
  { to: "/dashboard/admin/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/admin/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/admin/inventory", icon: "📊", label: "Inventory" },
];

export default function AdminSuppliers() {
  const {
    suppliers,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();

  return (
    <DashboardLayout navLinks={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <p className="text-gray-400 text-sm mt-1">
          {suppliers.length} suppliers
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          ➕ Add Supplier
        </h2>
        <SupplierForm onSuccess={fetchSuppliers} addSupplier={addSupplier} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {suppliers.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
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
    </DashboardLayout>
  );
}
