import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const [stats, setStats] = useState([
    { label: "Products tracked", value: "..." },
    { label: "Suppliers", value: "..." },
    { label: "Categories", value: "..." },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/auth/stats");
        setStats([
          { label: "Products tracked", value: res.data.products },
          { label: "Suppliers", value: res.data.suppliers },
          { label: "Categories", value: res.data.categories },
        ]);
      } catch {
        setStats([
          { label: "Products tracked", value: "—" },
          { label: "Suppliers", value: "—" },
          { label: "Categories", value: "—" },
        ]);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: "📦",
      title: "Products",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200",
      desc: "Manage your full product catalog with create, read, update and delete operations.",
    },
    {
      icon: "🏭",
      title: "Suppliers",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200",
      desc: "Track suppliers and link them directly to your products and stock.",
    },
    {
      icon: "📊",
      title: "Inventory",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-200",
      desc: "Monitor stock levels, low stock alerts, and transaction history.",
    },
  ];

  const roles = [
    {
      icon: "👤",
      title: "Staff",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-300",
      badge: "bg-blue-100 text-blue-700",
      perms: ["View products", "Add new stock", "Update quantities"],
    },
    {
      icon: "🧑‍💼",
      title: "Manager",
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-300",
      badge: "bg-purple-100 text-purple-700",
      perms: ["All Staff permissions", "Manage suppliers", "View reports"],
    },
    {
      icon: "🛡️",
      title: "Admin",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-300",
      badge: "bg-green-100 text-green-700",
      perms: ["Full system access", "Manage users & roles", "Delete records"],
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create an account",
      desc: "Sign up in seconds with your email and choose your role.",
    },
    {
      step: "02",
      title: "Set up your inventory",
      desc: "Add products, categories, and link your suppliers.",
    },
    {
      step: "03",
      title: "Track & manage",
      desc: "Monitor stock levels and manage transactions in real time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-emerald-50 py-28 px-6 text-center border-b border-emerald-100">
        <span className="inline-block text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
          Role-Based Inventory System
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-5 leading-tight">
          Manage your inventory <br />
          <span className="text-emerald-600">the smart way</span>
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto mb-8 leading-relaxed">
          A clean, modular inventory management system with role-based access
          for Staff, Managers, and Admins.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition-colors text-sm"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 border border-emerald-300 hover:border-emerald-500 text-emerald-700 font-medium rounded-lg transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-16 flex items-center justify-center gap-12 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={`text-3xl font-extrabold ${stat.value === "..." ? "text-emerald-300 animate-pulse" : "text-gray-800"}`}
              >
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800">
              Everything you need
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Built to handle real inventory workflows out of the box.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`border-2 ${f.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white`}
              >
                <div
                  className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className={`text-base font-bold ${f.color} mb-2`}>
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800">
              Role-Based Access
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Each role gets exactly the access it needs — nothing more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div
                key={r.title}
                className={`${r.bg} border-2 ${r.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{r.icon}</span>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${r.badge}`}
                  >
                    {r.title}
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {r.perms.map((perm) => (
                    <li
                      key={perm}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="text-green-500 font-bold text-base">
                        ✓
                      </span>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            How it works
          </h2>
          <p className="text-gray-400 text-sm mb-12">
            Get up and running in three simple steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center bg-emerald-50 border-t border-emerald-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Ready to get started?
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
          Create your account in seconds and start managing your inventory
          today.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            className="inline-block px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition-colors text-sm"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="inline-block px-7 py-3 border border-emerald-300 hover:border-emerald-500 text-emerald-700 font-medium rounded-lg transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
