import DashboardLayout from "../../layouts/DashboardLayout";
import InventoryTracking from "../../components/InventoryTracking";
import { useInventory } from "../../hooks/useInventory";
import { useProducts } from "../../hooks/useProducts";

const managerLinks = [
  { to: "/dashboard/manager", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/manager/products", icon: "📦", label: "Products" },
  { to: "/dashboard/manager/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/manager/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/manager/inventory", icon: "📊", label: "Inventory" },
];

export default function ManagerInventory() {
  const {
    transactions,
    fetchInventory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useInventory();
  const { products, fetchProducts } = useProducts();

  return (
    <DashboardLayout navLinks={managerLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Tracking</h1>
        <p className="text-gray-400 text-sm mt-1">
          {transactions.length} transactions
        </p>
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
