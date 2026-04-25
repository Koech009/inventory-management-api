import DashboardLayout from "../../layouts/DashboardLayout";
import InventoryTracking from "../../components/InventoryTracking";
import { useInventory } from "../../hooks/useInventory";
import { useProducts } from "../../hooks/useProducts";

const adminLinks = [
  { to: "/dashboard/admin", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/admin/users", icon: "👥", label: "Users" },
  { to: "/dashboard/admin/products", icon: "📦", label: "Products" },
  { to: "/dashboard/admin/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/admin/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/admin/inventory", icon: "📊", label: "Inventory" },
];

export default function AdminInventory() {
  const {
    transactions,
    fetchInventory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    error,
  } = useInventory();
  const { products, fetchProducts } = useProducts();

  return (
    <DashboardLayout navLinks={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Tracking</h1>
        <p className="text-gray-400 text-sm mt-1">
          {transactions.length} transactions
        </p>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <InventoryTracking
          transactions={transactions}
          products={products}
          onUpdated={() => {
            fetchInventory();
            fetchProducts();
          }}
          addTransaction={addTransaction}
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
        />
      </div>
    </DashboardLayout>
  );
}
