import DashboardLayout from "../../layouts/DashboardLayout";
import useUsers from "../../hooks/useUsers";

const adminLinks = [
  { to: "/dashboard/admin", icon: "🏠", label: "Overview", end: true },
  { to: "/dashboard/admin/users", icon: "👥", label: "Users" },
  { to: "/dashboard/admin/products", icon: "📦", label: "Products" },
  { to: "/dashboard/admin/categories", icon: "🏷️", label: "Categories" },
  { to: "/dashboard/admin/suppliers", icon: "🏭", label: "Suppliers" },
  { to: "/dashboard/admin/inventory", icon: "📊", label: "Inventory" },
];

export default function AdminUsers() {
  const { users, deleteUser, updateUserRole } = useUsers();

  return (
    <DashboardLayout navLinks={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-400 text-sm mt-1">
          {users.length} registered users
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Username", "Email", "Role", "Actions"].map((h) => (
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
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{u.username}</td>
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
