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
    loading,
    error,
    fetchInventory,
    addTransaction,
    updateTransaction,
  } = useInventory();
  const { products, fetchProducts } = useProducts();

  const handleUpdated = () => {
    fetchInventory();
    fetchProducts();
  };

  return (
    <DashboardLayout navLinks={managerLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Tracking</h1>
        <p className="text-gray-400 text-sm mt-1">
          {loading ? "Loading..." : `${transactions.length} transactions`}
        </p>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <InventoryTracking
        transactions={transactions}
        products={products}
        onUpdated={handleUpdated}
        addTransaction={addTransaction}
        updateTransaction={updateTransaction}
        allowedTypes={["in", "out"]}
      />
    </DashboardLayout>
  );
}
