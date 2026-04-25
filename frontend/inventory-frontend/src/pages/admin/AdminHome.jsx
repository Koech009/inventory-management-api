import DashboardLayout from "../../layouts/DashboardLayout";
import { useProducts } from "../../hooks/useProducts";
import { useCategory } from "../../hooks/useCategory";
import { useSuppliers } from "../../hooks/useSuppliers";
import useUsers from "../../hooks/useUsers";
import { useInventory } from "../../hooks/useInventory";

const adminLinks = [
  { to: "/dashboard/admin", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/admin/users", icon: "👥", label: "Users" },
  { to: "/dashboard/admin/products", icon: "📦", label: "Products" },
  { to: "/dashboard/admin/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/admin/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/admin/inventory", icon: "📊", label: "Inventory" },
];

export default function AdminHome() {
  const { products } = useProducts();
  const { categories } = useCategory();
  const { suppliers } = useSuppliers();
  const { users } = useUsers();
  const { transactions } = useInventory();

  const stats = [
    {
      label: "Users",
      value: users.length,
      icon: "👥",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    {
      label: "Products",
      value: products.length,
      icon: "📦",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: "🏷️",
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      label: "Suppliers",
      value: suppliers.length,
      icon: "🏭",
      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
    {
      label: "Transactions",
      value: transactions.length,
      icon: "📊",
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
  ];

  return (
    <DashboardLayout navLinks={adminLinks}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back — here's a summary of your system.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`border-2 rounded-xl p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-3xl font-extrabold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
