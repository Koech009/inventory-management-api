import DashboardLayout from "../../layouts/DashboardLayout";
import ProductForm from "../../components/ProductForm";
import { useProducts } from "../../hooks/useProducts";

const staffLinks = [
  { to: "/dashboard/staff", icon: "➕", label: "Add Product", end: true },
  { to: "/dashboard/staff/products", icon: "📦", label: "All Products" },
];

export default function StaffHome() {
  const { addProduct, fetchProducts, page } = useProducts();

  return (
    <DashboardLayout navLinks={staffLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-400 text-sm mt-1">
          Create a product — you can edit or delete it later.
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <ProductForm
          onSuccess={() => fetchProducts(page)}
          addProduct={addProduct}
        />
      </div>
    </DashboardLayout>
  );
}
