import { useState } from "react";

const Sidebar = ({ activePage, setActivePage, user }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
      <div className="p-8">
        <h1 className="text-2xl font-black text-green-600 tracking-tighter uppercase">
          Pilahin <span className="text-gray-800 text-sm">Aja</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {[
          { id: "dashboard", label: "Dashboard", icon: "fa-columns" },
          { id: "scan", label: "Smart Scan AI", icon: "fa-camera" },
          { id: "panduan", label: "Panduan Daur Ulang", icon: "fa-book" },
          { id: "reward", label: "Tukar Reward", icon: "fa-gift" },
          { id: "komunitas", label: "Komunitas", icon: "fa-users" },
          { id: "gps", label: "Lokasi Terdekat", icon: "fa-map-marker-alt" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition duration-200 ${
              activePage === item.id
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-500 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <i className={`fas ${item.icon} w-6`}></i> {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <div className="bg-green-50 p-4 rounded-2xl">
          <p className="text-xs font-bold text-green-700 uppercase mb-1">
            Eco Warrior
          </p>
          <p className="text-[10px] text-green-600 mb-3">{user?.totalXP} / 1000 XP</p>
          <div className="w-full bg-green-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-green-600 h-full transition-all duration-500"
              style={{ width: `${Math.min((user?.totalXP / 1000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
