import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // Ensure this import path is correct
import SubjectForm from "../components/SubjectForm";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar from "../components/Sidebar";

const MySwal = withReactContent(Swal);

function ManageSubjects() {
  const { logout } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
      const response = await api.get("/api/v1/subjects");
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleFormSubmit = async (formData) => {
    const isEditing = !!currentSubject;
    const method = isEditing ? "put" : "post";
    // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
    const url = isEditing
      ? `/api/v1/subjects/${currentSubject.id}`
      : "/api/v1/subjects";

    try {
      await api({
        method: method,
        url: url,
        data: formData,
      });

      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Mata pelajaran berhasil ${
          isEditing ? "diperbarui" : "ditambahkan"
        }.`,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchSubjects();
      closeModal();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan data. Silakan coba lagi.",
      });
    }
  };

  const handleDeleteSubject = async (id) => {
    const result = await MySwal.fire({
      title: "Yakin ingin menghapus?",
      text: "Semua bab dan kuis di dalamnya akan ikut terhapus!",
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
        await api.delete(`/api/v1/subjects/${id}`);
        MySwal.fire("Dihapus!", "Mata pelajaran berhasil dihapus.", "success");
        fetchSubjects();
      } catch (error) {
        console.error("Gagal menghapus mata pelajaran:", error);
        MySwal.fire("Gagal!", "Gagal menghapus mata pelajaran.", "error");
      }
    }
  };

  const openModal = (subject = null) => {
    setCurrentSubject(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSubject(null);
  };

  // The entire JSX return block is already perfect, no changes needed.
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Pelajaran
          </h1>
          <button
            type="button"
            onClick={() => openModal()}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
          >
            + Tambah Mata Pelajaran
          </button>
        </header>
        <section className="p-6 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                Memuat data...
              </div>
            ) : subjects.length > 0 ? (
              subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {subject.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {subject.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/subject/${subject.id}`}
                      className="py-2 px-4 bg-purple-600 text-white font-semibold text-sm rounded-md hover:bg-purple-700 transition duration-300"
                    >
                      Kelola Bab
                    </Link>
                    <button
                      type="button"
                      onClick={() => openModal(subject)}
                      className="py-2 px-4 bg-yellow-500 text-white font-semibold text-sm rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="py-2 px-4 bg-red-500 text-white font-semibold text-sm rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                Belum ada mata pelajaran yang dibuat.
              </div>
            )}
          </div>
        </section>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          currentSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran Baru"
        }
      >
        <SubjectForm onSubmit={handleFormSubmit} initialData={currentSubject} />
      </Modal>
    </div>
  );
}


export default ManageSubjects;
