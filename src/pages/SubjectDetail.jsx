import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // Ensure this import path is correct
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import ChapterForm from "../components/ChapterForm";
import ChapterDetailView from "../components/ChapterDetailView";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";

const MySwal = withReactContent(Swal);

function SubjectDetail() {
  const { id: subjectId } = useParams();
  const { logout } = useContext(AuthContext);

  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [chapterToView, setChapterToView] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!subjectId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [subjectRes, chaptersRes] = await Promise.all([
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        api.get(`/api/v1/subjects/${subjectId}`),
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        api.get(`/api/v1/chapters/for-subject/${subjectId}`),
      ]);
      setSubject(subjectRes.data.data);
      setChapters(chaptersRes.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal Memuat",
        text: "Tidak dapat memuat data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async (formData) => {
    try {
      // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
      await api.post(`/api/v1/chapters/for-subject/${subjectId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Bab berhasil dibuat.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
      closeFormModal();
    } catch (error) {
      console.error("Gagal menyimpan bab:", error);
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan bab. Silakan coba lagi.",
      });
    }
  };

  const handleDeleteChapter = async (id) => {
    const result = await MySwal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
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
        await api.delete(`/api/v1/chapters/${id}`);
        MySwal.fire("Dihapus!", "Bab berhasil dihapus.", "success");
        fetchData();
      } catch (error) {
        console.error("Gagal menghapus bab:", error);
        MySwal.fire("Gagal!", "Gagal menghapus bab.", "error");
      }
    }
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const openDetailModal = (chapter) => {
    setChapterToView(chapter);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setChapterToView(null);
  };

  if (isLoading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar onLogout={logout} onClose={() => {}} />
        <main className="flex-1 flex items-center justify-center p-8">
          <p className="text-gray-500 text-lg">Memuat data mata pelajaran...</p>
        </main>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar onLogout={logout} onClose={() => {}} />
        <main className="flex-1 flex items-center justify-center p-8">
          <p className="text-gray-500 text-lg">
            Mata pelajaran tidak ditemukan.
          </p>
        </main>
      </div>
    );
  }
  
  // The entire JSX return block is already perfect, no changes needed.
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            Kelola Bab: <span className="text-blue-600">{subject.title}</span>
          </h1>
          <button
            type="button"
            onClick={openFormModal}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
          >
            + Tambah Bab Baru
          </button>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {chapters.length > 0 ? (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id || chapter._id}
                  className="p-4 border border-gray-200 rounded-lg transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1 mb-4 sm:mb-0 sm:pr-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {chapter.title}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openDetailModal(chapter)}
                        className="py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-300 text-sm"
                      >
                        Lihat Detail
                      </button>
                      <Link to={`/quiz/${chapter.id || chapter._id}`}>
                        <button
                          type="button"
                          className="py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 text-sm"
                        >
                          Kelola Kuis
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteChapter(chapter.id || chapter._id)
                        }
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Belum ada bab untuk mata pelajaran ini.
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title="Tambah Bab Baru"
      >
        <ChapterForm onSubmit={handleFormSubmit} initialData={null} />
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title="Detail Bab"
      >
        <ChapterDetailView chapter={chapterToView} onClose={closeDetailModal} />
      </Modal>
    </div>
  );
}

export default SubjectDetail;