import React, { useState, useEffect } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  // Inisialisasi State dari localStorage atau nilai default
  const [user, setUser] = useState(() => {
    const savedData = localStorage.getItem('recycle_user_data');
    return savedData ? JSON.parse(savedData) : {
      pts: 24500,
      xp: 700,
      rankXp: "9.2k"
    };
  });

  // Simpan data terbaru ke localStorage tiap ada perubahan status user
  useEffect(() => {
    localStorage.setItem('recycle_user_data', JSON.stringify(user));
  }, [user]);

  const triggerToast = (msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3000);
  };

  const handleScan = () => {
    const newXp = user.xp + 150;
    const newPts = user.pts + 500;
    const newRankXp = (newXp / 1000 + 8.5).toFixed(1) + "k";

    setUser({ pts: newPts, xp: newXp, rankXp: newRankXp });
    triggerToast("Scan Berhasil! +500 Poin & +150 XP");
  };

  const handleRedeem = (cost) => {
    if (user.pts >= cost) {
      setUser(prev => ({ ...prev, pts: prev.pts - cost }));
      triggerToast("Reward berhasil ditukar!");
    } else {
      triggerToast("Poin tidak cukup!", true);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* SIDEBAR NAV */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-2xl font-black text-green-600 tracking-tighter uppercase">Pilahin <span className="text-gray-800 text-sm">Aja</span></h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-columns' },
            { id: 'scan', label: 'Smart Scan AI', icon: 'fa-camera' },
            { id: 'panduan', label: 'Panduan Daur Ulang', icon: 'fa-book' },
            { id: 'reward', label: 'Tukar Reward', icon: 'fa-gift' },
            { id: 'komunitas', label: 'Komunitas', icon: 'fa-users' },
            { id: 'gps', label: 'Lokasi Terdekat', icon: 'fa-map-marker-alt' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition duration-200 ${
                activePage === item.id 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i> {item.label}
            </button>
          ))}
        </nav>

        {/* XP BAR */}
        <div className="p-6 border-t border-gray-100">
          <div className="bg-green-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-green-700 uppercase mb-1">Eco Warrior</p>
            <p className="text-[10px] text-green-600 mb-3">{user.xp} / 1000 XP</p>
            <div className="w-full bg-green-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-600 h-full transition-all duration-500" style={{ width: `${Math.min((user.xp / 1000) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-4 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg capitalize">{activePage}</h2>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">Poin Kamu</p>
              <p className="text-lg font-black text-green-600">{user.pts.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-lg">RD</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {activePage === 'dashboard' && (
            <div className="space-y-8">
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-green-600 to-emerald-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl text-white">
                  <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl font-extrabold mb-4">Selamat Pagi, Hero! 👋</h2>
                    <p className="text-green-100 mb-8 italic text-sm">Hari ini kamu telah menyelamatkan lingkungan dari 2.4kg sampah plastik. Ayo kumpulkan lebih banyak!</p>
                    <button onClick={() => setActivePage('scan')} className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition shadow-lg">
                      <i className="fas fa-camera mr-2"></i> Scan Sampah Sekarang
                    </button>
                  </div>
                  <i className="fas fa-leaf absolute -right-10 -bottom-10 text-[15rem] opacity-10 rotate-12"></i>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h3 className="font-bold text-gray-400 uppercase text-xs">Achievement Terbaru</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 text-xl"><i className="fas fa-medal"></i></div>
                    <div>
                      <p className="font-bold text-gray-800">Master of Plastic</p>
                      <p className="text-xs text-gray-400">Pilah 50kg sampah plastik</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">Lihat Semua Badge</button>
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-gray-800">Statistik Daur Ulang</h3>
                    <select className="bg-gray-50 border-none rounded-lg text-xs font-bold p-2 outline-none">
                      <option>7 Hari Terakhir</option>
                      <option>Bulan Ini</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-48 px-4">
                    {[40, 60, 90, 30, 55, 80, 45].map((height, i) => (
                      <div key={i} className={`w-full rounded-t-xl transition-all duration-500 ${height === 90 ? 'bg-green-500' : 'bg-green-100'}`} style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-gray-400 uppercase">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => <span key={day}>{day}</span>)}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-6">Leaderboard Lokal</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-gray-300 w-4">1</span>
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 font-bold text-sm">Budi Santoso</div>
                      <p className="text-xs font-black text-gray-400">12.5k</p>
                    </div>
                    <div className="flex items-center gap-4 border-l-4 border-green-500 pl-4 bg-green-50 py-2 rounded-r-xl">
                      <span className="font-black text-green-600 w-4">2</span>
                      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shadow-md">RD</div>
                      <div className="flex-1 font-bold text-sm text-green-700">Kamu</div>
                      <p className="text-xs font-black text-green-600">{user.rankXp}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-gray-300 w-4">3</span>
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 font-bold text-sm">Siti Aminah</div>
                      <p className="text-xs font-black text-gray-400">8.7k</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activePage === 'scan' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="border-4 border-dashed border-gray-200 rounded-3xl p-12 mb-6">
                <i className="fas fa-camera text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 font-bold">Arahkan kamera ke sampah</p>
              </div>
              <button onClick={handleScan} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-700 transition transform active:scale-95 shadow-lg">
                Ambil Foto & Analisis (AI)
              </button>
            </div>
          )}

          {activePage === 'panduan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4"><i className="fas fa-bottle-water"></i></div>
                <h4 className="font-bold mb-2 text-gray-800">Botol Plastik PET</h4>
                <p className="text-sm text-gray-500">Bisa didaur ulang menjadi serat poliester atau botol baru.</p>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold mt-4 inline-block tracking-widest">+50 XP / Kg</span>
              </div>
            </div>
          )}

          {activePage === 'reward' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-green-500 shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Voucher Belanja</p>
                  <h4 className="font-bold text-xl text-green-700">Rp 50.000</h4>
                </div>
                <button onClick={() => handleRedeem(5000)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-green-700 transition">
                  Tukar 5k Poin
                </button>
              </div>
            </div>
          )}

          {activePage === 'komunitas' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex-shrink-0"></div>
              <input type="text" placeholder="Bagikan aksi hijau kamu hari ini..." className="bg-gray-50 border-none rounded-xl flex-1 px-4 py-2 outline-none focus:ring-2 focus:ring-green-400" />
              <button className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition"><i className="fas fa-paper-plane"></i></button>
            </div>
          )}

          {activePage === 'gps' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="font-bold mb-6 italic"><i className="fas fa-search-location mr-2 text-green-600"></i>Pengepul & Bank Sampah Terdekat</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-2xl flex justify-between items-center border border-green-100 transition hover:scale-[1.01] cursor-pointer">
                  <div>
                    <p className="font-bold text-gray-800">Bank Sampah Sukapura</p>
                    <p className="text-xs text-gray-400">0.8 km • Jl. Telekomunikasi</p>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">BUKA</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* TOAST COMPONENT */}
      <div className={`fixed bottom-10 right-10 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl transition-all duration-500 z-50 flex items-center gap-4 ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
      }`}>
        <div className={`${toast.isError ? 'bg-red-500' : 'bg-green-500'} p-2 rounded-lg`}>
          <i className={`fas ${toast.isError ? 'fa-times' : 'fa-check'} text-white`}></i>
        </div>
        <div>{toast.message}</div>
      </div>

    </div>
  );
}