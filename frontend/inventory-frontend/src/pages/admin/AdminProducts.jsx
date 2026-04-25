import DashboardLayout from "../../layouts/DashboardLayout";
import ProductForm from "../../components/ProductForm";
import ProductCard from "../../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";

const adminLinks = [
  { to: "/dashboard/admin", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/admin/users", icon: "👥", label: "Users" },
  { to: "/dashboard/admin/products", icon: "📦", label: "Products" },
  { to: "/dashboard/admin/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/admin/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/admin/inventory", icon: "📊", label: "Inventory" },
];

export default function AdminProducts() {
  const {
    products,
    meta,
    page,
    fetchProducts,
    nextPage,
    prevPage,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  return (
    <DashboardLayout navLinks={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-400 text-sm mt-1">
          {meta?.total_items ?? products.length} total products
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          ➕ Add Product
        </h2>
        <ProductForm
          onSuccess={() => fetchProducts(page)}
          addProduct={addProduct}
        />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {[
                "Name",
                "Description",
                "Price",
                "Quantity",
                "Category",
                "Supplier",
                "Actions",
              ].map((h) => (
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
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onUpdated={() => fetchProducts(page)}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />
            ))}
          </tbody>
        </table>
        {meta && meta.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={!meta.has_prev}
              className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-400">
              Page {meta.page} of {meta.total_pages}
            </span>
            <button
              onClick={nextPage}
              disabled={!meta.has_next}
              className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
