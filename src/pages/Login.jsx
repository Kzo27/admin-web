import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Komponen SVG untuk ilustrasi, bisa juga diganti dengan tag <img>
const LoginIllustration = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#D1E3FF"
      d="M38.8,-49.9C51,-37.1,62.2,-23,65.3,-6.9C68.4,9.2,63.4,27.3,53,41.9C42.6,56.5,27.8,67.6,10.7,71.1C-6.3,74.5,-25.7,70.3,-42.2,60.2C-58.7,50.1,-72.3,34.1,-77.3,16C-82.3,-2,-78.7,-22.1,-68.8,-37.2C-58.8,-52.3,-42.5,-62.4,-27.1,-65.8C-11.8,-69.2,2.7,-66,16.5,-61.1C30.3,-56.2,46.6,-49.6,38.8,-49.9Z"
      transform="translate(100 100)"
    />
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Email atau password salah.");
      }
      // Navigasi akan di-handle oleh context jika login berhasil
    } catch (err) {
      setError("Terjadi kesalahan pada server. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2">
        {/* Kolom Kiri: Ilustrasi */}
        <div className="hidden lg:flex items-center justify-center bg-blue-50 relative p-8">
          <div className="absolute inset-0">
            <LoginIllustration />
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Selamat Datang!
            </h2>
            <p className="mt-2 text-gray-600">
              Platform untuk mengasah kemampuan Anda.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Form Login */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Login Pengajar
              </h1>
              <p className="mt-2 text-gray-500">
                Silakan masuk untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 sr-only">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>


              <div className="text-right text-sm mb-15">
              
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:bg-blue-300"
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
