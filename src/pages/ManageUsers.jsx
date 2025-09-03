import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // Ensure this import path is correct
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function ManageUsers() {
  const { logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
      const response = await api.get("/api/v1/users");
      const filteredUsers = response.data.data.filter(
        (user) => user.role === "siswa"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Tidak dapat mengambil daftar pengguna dari server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const result = await MySwal.fire({
      title: "Anda Yakin?",
      text: "Data pengguna yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        await api.delete(`/api/v1/users/${userId}`);
        MySwal.fire("Dihapus!", "Pengguna berhasil dihapus.", "success");
        fetchUsers();
      } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
        MySwal.fire(
          "Gagal!",
          "Terjadi kesalahan saat menghapus pengguna.",
          "error"
        );
      }
    }
  };

  // The entire JSX return block is already perfect, no changes needed.
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Pengguna
          </h1>
        </header>
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Daftar Pengguna Terdaftar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tanggal Bergabung
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      Belum ada pengguna yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ManageUsers;