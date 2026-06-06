import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_SERVER_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_id", data.user.id);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-[40px] shadow-lg overflow-hidden grid lg:grid-cols-2">
        <div className="bg-linear-to-br from-green-50 to-white p-10 lg:p-16 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-black">
              <span className="text-green-600">PILAHIN</span>
              <span className="text-slate-900 text-2xl ml-2">AJA</span>
            </h1>

            <div className="flex justify-center mt-12">
              <img
                src="/earth-eco.png"
                alt="Eco Illustration"
                className="max-w-md w-60 animate-float"
              />
            </div>

            <div className="mt-16">
              <h2 className="text-6xl font-black text-slate-900 leading-tight">
                Pilah Sampah,
                <br />
                <span className="text-green-600">Selamatkan Bumi</span>
              </h2>

              <p className="mt-6 text-xl text-gray-500 max-w-lg">
                Bersama PilahinAja, setiap langkah kecilmu berdampak besar untuk
                lingkungan.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-white p-8 lg:p-16">
          <div className="w-full max-w-lg border border-gray-100 rounded-4xl p-10 shadow-sm">
            <h2 className="text-4xl font-black text-slate-800">
              Selamat Datang Kembali! 🌱
            </h2>

            <p className="text-gray-500 mt-3">
              Masuk untuk melanjutkan perjalananmu menjadi Eco Warrior.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="font-semibold text-slate-700">Email</label>

                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 p-4 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Password</label>

                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 p-4 rounded-xl border border-gray-200 outline-none focus:border-green-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 transition text-white font-bold py-4 rounded-xl"
              >
                Masuk
              </button>

              <p className="text-center text-gray-500">
                Belum punya akun?{" "}
                <span className="font-bold text-green-600 cursor-pointer" onClick={() => navigate("/register")}>
                  Daftar Sekarang
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};