import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // Ensure this import path is correct
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function ManageTryOuts() {
  const { logout } = useContext(AuthContext);
  const [tryOuts, setTryOuts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTryOuts = async () => {
    try {
      setLoading(true);
      // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
      const response = await api.get("/api/v1/tryouts");
      setTryOuts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data Try Out:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTryOuts();
  }, []);

  const handleDeleteTryOut = async (id) => {
    const result = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        await api.delete(`/api/v1/tryouts/${id}`);
        MySwal.fire("Dihapus!", "Paket Try Out berhasil dihapus.", "success");
        fetchTryOuts(); // Re-fetch data to update the list
      } catch (error) {
        console.error("Gagal menghapus Try Out:", error);
        MySwal.fire("Gagal!", "Gagal menghapus paket Try Out.", "error");
      }
    }
  };

  // The entire JSX return block is already perfect, no changes needed.
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Kelola Try Out
          </h1>
          <Link to="/create-tryout">
            <button
              type="button"
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
            >
              + Buat Paket Baru
            </button>
          </Link>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Daftar Paket Try Out
          </h2>
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Memuat data...
            </div>
          ) : tryOuts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tryOuts.map((to) => (
                <div
                  key={to.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-lg flex flex-col border-t-4 border-blue-500"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {to.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {to.description}
                    </p>

                    <div className="border-t border-gray-200 pt-4 mb-4 text-sm text-gray-500 space-y-2">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
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
                        <span>
                          <span className="font-semibold">
                            {to.questionsCount || 0}
                          </span>{" "}
                          Total Soal
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span>
                          <span className="font-semibold">
                            {to.duration || 0}
                          </span>{" "}
                          Menit
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Link to={`/tryout/${to.id}/results`}>
                        <button
                          type="button"
                          className="py-2 px-4 bg-purple-600 text-white font-semibold text-sm rounded-md hover:bg-purple-700 transition duration-300"
                        >
                          Lihat Hasil
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteTryOut(to.id)}
                        className="py-2 px-4 bg-red-600 text-white font-semibold text-sm rounded-md hover:bg-red-700 transition duration-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Belum ada paket Try Out yang dibuat.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageTryOuts;


