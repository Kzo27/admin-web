import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // Ensure this import path is correct
import Sidebar from "../components/Sidebar";

// StatCard component is already perfect, no changes needed.
const StatCard = ({ icon, title, value, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {loading ? "..." : value}
      </p>
    </div>
  </div>
);

function Dashboard() {
  const { logout, user } = useContext(AuthContext);
  const [stats, setStats] = useState({ users: 0, subjects: 0, tryouts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // ▼▼▼ API PATHS ADJUSTED HERE ▼▼▼
        const [usersRes, subjectsRes, tryoutsRes] = await Promise.all([
          api.get("/api/v1/users"),
          api.get("/api/v1/subjects"),
          api.get("/api/v1/tryouts"),
        ]);

        // This logic is already correct
        setStats({
          users: usersRes.data.data.length || 0,
          subjects: subjectsRes.data.data.length || 0,
          tryouts: tryoutsRes.data.data.length || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // The entire JSX return block is already perfect, no changes needed.
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-lg text-gray-600">
            Selamat Datang, {user ? user.name : "Pengguna"}!
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Pengguna"
            value={stats.users}
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            }
          />
          <StatCard
            title="Total Pelajaran"
            value={stats.subjects}
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            }
          />
          <StatCard
            title="Total Tryout"
            value={stats.tryouts}
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            }
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/subjects"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center space-x-4"
            >
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Kelola Pelajaran
                </h3>
                <p className="text-gray-600">
                  Tambah, edit, atau hapus mata pelajaran.
                </p>
              </div>
            </Link>
            <Link
              to="/tryouts"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center space-x-4"
            >
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Kelola Tryout
                </h3>
                <p className="text-gray-600">
                  Lihat, atur, dan analisis hasil tryout.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;


