import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0d1117] border-b border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-6 h-[62px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-[34px] h-[34px] bg-green-500 rounded-[9px] flex items-center justify-center flex-shrink-0 group-hover:bg-green-400 transition-colors">
            <div className="w-[34px] h-[34px] bg-green-500 rounded-[9px] flex items-center justify-center flex-shrink-0 group-hover:bg-green-400 transition-colors">
              <span className="text-emerald-950 font-black text-[11px] font-mono tracking-tight">
                IVM
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-[2px]">
            <span className="text-white font-extrabold text-[14.5px] tracking-[-0.4px] leading-none">
              Inventory Management
            </span>
            <span className="text-green-400 font-extrabold text-[14.5px] tracking-[-0.4px] leading-none">
              System
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-[13px] font-medium text-slate-300 hover:text-white px-4 py-[7px] rounded-lg border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.05] transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-[13px] font-bold px-4 py-[7px] bg-green-500 hover:bg-green-400 text-emerald-950 rounded-lg transition-colors tracking-[-0.2px]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
