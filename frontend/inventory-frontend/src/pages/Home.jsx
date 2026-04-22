// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-black font-mono">
            IV
          </div>
          <span className="text-white font-extrabold text-[15px] tracking-tight">
            Inventory<span className="text-green-400">API</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold px-4 py-1.5 bg-green-500 hover:bg-green-400 text-white rounded transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center text-white text-xs font-black font-mono">
            IV
          </div>
          <span className="text-white font-bold text-sm">
            Inventory<span className="text-green-400">API</span>
          </span>
        </div>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} InventoryAPI. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="hover:text-white transition-colors">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [stats, setStats] = useState([
    { label: "Products tracked", value: "..." },
    { label: "Suppliers", value: "..." },
    { label: "Categories", value: "..." },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, supRes, catRes] = await Promise.all([
          API.get("/products"),
          API.get("/suppliers"),
          API.get("/categories"),
        ]);
        setStats([
          { label: "Products tracked", value: prodRes.data.length },
          { label: "Suppliers", value: supRes.data.length },
          { label: "Categories", value: catRes.data.length },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
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
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="bg-gray-900 py-28 px-6 text-center">
        <span className="inline-block text-xs font-semibold bg-green-900 text-green-400 px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
          Role-Based Inventory System
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
          Manage your inventory <br />
          <span className="text-green-400">the smart way</span>
        </h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
          A clean, modular inventory management system with role-based access
          for Staff, Managers, and Admins.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow transition-colors text-sm"
          >
            Get Started — it's free
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium rounded-lg transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Live Stats */}
        <div className="mt-16 flex items-center justify-center gap-12 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={`text-3xl font-extrabold ${
                  stat.value === "..."
                    ? "text-gray-600 animate-pulse"
                    : "text-white"
                }`}
              >
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
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
      <section className="py-20 px-6 bg-gray-100">
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
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">How it works</h2>
          <p className="text-gray-400 text-sm mb-12">
            Get up and running in three simple steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white font-black text-sm flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center bg-green-600">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready to get started?
        </h2>
        <p className="text-green-100 text-sm mb-8 max-w-md mx-auto">
          Create your account in seconds and start managing your inventory
          today.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            className="inline-block px-7 py-3 bg-white hover:bg-gray-100 text-green-700 font-semibold rounded-lg shadow transition-colors text-sm"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="inline-block px-7 py-3 border border-green-400 hover:border-white text-white font-medium rounded-lg transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
