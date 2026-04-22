export default function DashboardHeader({ title, subtitle, role }) {
  const roleBadge = {
    Admin: "bg-red-100 text-red-600",
    Manager: "bg-purple-100 text-purple-600",
    Staff: "bg-green-100 text-green-600",
  };

  return (
    <div className="mb-8 pb-5 border-b border-gray-200 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {role && (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${roleBadge[role] || "bg-gray-100 text-gray-500"}`}
        >
          {role}
        </span>
      )}
    </div>
  );
}
