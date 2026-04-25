export default function Footer() {
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
      </div>
    </footer>
  );
}
