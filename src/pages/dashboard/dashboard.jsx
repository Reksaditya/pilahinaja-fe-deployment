import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/sidebar";
import CameraPage from "./camera";

const dashboardMenu = [
  { id: "dashboard", label: "Dashboard", icon: "fa-columns" },
  { id: "scan", label: "Smart Scan AI", icon: "fa-camera" },
  { id: "panduan", label: "Panduan Daur Ulang", icon: "fa-book" },
  { id: "reward", label: "Tukar Reward", icon: "fa-gift" },
  { id: "komunitas", label: "Komunitas", icon: "fa-users" },
  { id: "gps", label: "Lokasi Terdekat", icon: "fa-map-marker-alt" },
];

export const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("Invalid user in localStorage:", err);
      return null;
    }
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const id = localStorage.getItem("user_id");
        const API_URL = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        const userData = data.user ?? data;

        setUser(userData);

        localStorage.setItem("user", JSON.stringify(userData));

        console.log("userid:", userData.id);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (userData?.id) {
          localStorage.setItem("user_id", userData.id);
        }
      } catch (err) {
        console.error(err);
      }
      // finally {
      //   setLoading(false);
      // }
    };

    getProfile();
  }, []);

  const triggerToast = (msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(
      () => setToast({ show: false, message: "", isError: false }),
      3000,
    );
  };

  const handleScan = () => {
    const newXp = user.totalXP + 150;
    const newPts = user.totalPoint + 500;
    const newRankXp = (newXp / 1000 + 8.5).toFixed(1) + "k";

    setUser({ totalPoint: newPts, totalXP: newXp, rankXp: newRankXp });
    triggerToast("Scan Berhasil! +500 Poin & +150 XP");
  };

  const handleRedeem = (cost) => {
    if (user.totalPoint >= cost) {
      setUser((prev) => ({ ...prev, totalPoint: prev.totalPoint - cost }));
      triggerToast("Reward berhasil ditukar!");
    } else {
      triggerToast("Poin tidak cukup!", true);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
      />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-4 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg capitalize">
            {activePage}
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Poin Kamu
              </p>
              <p className="text-lg font-black text-green-600">
                {(user?.totalPoint || 0).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : "US"}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activePage === "dashboard" && (
            <div className="space-y-8">
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-linear-to-br from-green-600 to-emerald-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl text-white">
                  <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl font-extrabold mb-4">
                      Selamat Pagi, Hero! 👋
                    </h2>
                    <p className="text-green-100 mb-8 italic text-sm">
                      Hari ini kamu telah menyelamatkan lingkungan dari 2.4kg
                      sampah plastik. Ayo kumpulkan lebih banyak!
                    </p>
                    <button
                      onClick={() => setActivePage("scan")}
                      className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition shadow-lg"
                    >
                      <i className="fas fa-camera mr-2"></i> Scan Sampah
                      Sekarang
                    </button>
                  </div>
                  <i className="fas fa-leaf absolute -right-10 -bottom-10 text-[15rem] opacity-10 rotate-12"></i>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h3 className="font-bold text-gray-400 uppercase text-xs">
                    Achievement Terbaru
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 text-xl">
                      <i className="fas fa-medal"></i>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Master of Plastic
                      </p>
                      <p className="text-xs text-gray-400">
                        Pilah 50kg sampah plastik
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">
                    Lihat Semua Badge
                  </button>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-8 h-full">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm w-full h-screen">
                  <h3 className="font-bold text-gray-800 mb-6">
                    Leaderboard Lokal
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-gray-300 w-4">1</span>
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 font-bold text-sm">
                        Budi Santoso
                      </div>
                      <p className="text-xs font-black text-gray-400">12.5k</p>
                    </div>
                    <div className="flex items-center gap-4 border-l-4 border-green-500 pl-4 bg-green-50 py-2 rounded-r-xl">
                      <span className="font-black text-green-600 w-4">2</span>
                      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        {user?.username
                          ? user.username.slice(0, 2).toUpperCase()
                          : "US"}
                      </div>
                      <div className="flex-1 font-bold text-sm text-green-700">
                        {user.username}
                      </div>
                      <p className="text-xs font-black text-green-600">
                        {user.totalXP || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-gray-300 w-4">3</span>
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 font-bold text-sm">
                        Siti Aminah
                      </div>
                      <p className="text-xs font-black text-gray-400">8.7k</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activePage === "scan" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="border-4 border-dashed border-gray-200 rounded-3xl p-12 mb-6">
                <i className="fas fa-camera text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 font-bold">
                  Arahkan kamera ke sampah
                </p>
              </div>
              <CameraPage />
            </div>
          )}

          {activePage === "reward" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-green-500 shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Voucher Belanja
                  </p>
                  <h4 className="font-bold text-xl text-green-700">
                    Rp 50.000
                  </h4>
                </div>
                <button
                  onClick={() => handleRedeem(5000)}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-green-700 transition"
                >
                  Tukar 5k Poin
                </button>
              </div>
            </div>
          )}

          {activePage === "reward" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-green-500 shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Voucher Belanja
                  </p>
                  <h4 className="font-bold text-xl text-green-700">
                    Rp 50.000
                  </h4>
                </div>
                <button
                  onClick={() => handleRedeem(5000)}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-green-700 transition"
                >
                  Tukar 5k Poin
                </button>
              </div>
            </div>
          )}

          {activePage === "komunitas" && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full shrink-0"></div>
              <input
                type="text"
                placeholder="Bagikan aksi hijau kamu hari ini..."
                className="bg-gray-50 border-none rounded-xl flex-1 px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          )}
        </div>
      </main>

      <div
        className={`fixed bottom-10 right-10 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl transition-all duration-500 z-50 flex items-center gap-4 ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-32 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`${toast.isError ? "bg-red-500" : "bg-green-500"} p-2 rounded-lg`}
        >
          <i
            className={`fas ${toast.isError ? "fa-times" : "fa-check"} text-white`}
          ></i>
        </div>
        <div>{toast.message}</div>
      </div>
    </div>
  );
};
