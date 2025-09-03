import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api"; // Ensure this import path is correct
import QuizForm from "../components/QuizForm";
import Sidebar from "../components/Sidebar";

function ManageQuiz() {
  const { id: chapterId } = useParams();
  const { logout } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizFormKey, setQuizFormKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chapterRes, questionsRes] = await Promise.all([
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        api.get(`/api/v1/chapters/${chapterId}`),
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        api.get(`/api/v1/quizzes/for-chapter/${chapterId}`),
      ]);
      setChapter(chapterRes.data.data);
      setQuestions(questionsRes.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId) fetchData();
  }, [chapterId]);

  const handleQuizSubmit = async (formData) => {
    const isEditing = !!currentQuestion;
    const method = isEditing ? "put" : "post";
    // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
    const url = isEditing
      ? `/api/v1/quizzes/${currentQuestion.id}`
      : `/api/v1/quizzes/for-chapter/${chapterId}`;

    const dataToSend = {
      ...formData,
      chapterId: chapterId,
      subjectId: chapter.subjectId,
    };

    if (!isEditing) {
      dataToSend.number = questions.length + 1;
    }

    try {
      await api({ method, url, data: dataToSend });
      alert("Pertanyaan berhasil disimpan!");
      fetchData();
      setCurrentQuestion(null);
      if (!isEditing) {
        setQuizFormKey(Date.now());
      }
    } catch (error) {
      console.error(
        "Gagal menyimpan pertanyaan:",
        error.response?.data || error.message
      );
      alert(
        "Gagal menyimpan pertanyaan. Silakan periksa console untuk detail."
      );
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
      try {
        // ▼▼▼ API PATH ADJUSTED HERE ▼▼▼
        await api.delete(`/api/v1/quizzes/${id}`);
        alert("Pertanyaan berhasil dihapus!");
        fetchData();
      } catch (error) {
        console.error("Gagal menghapus pertanyaan:", error);
        alert("Gagal menghapus pertanyaan.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-100 h-screen overflow-hidden">
        <Sidebar onLogout={logout} onClose={() => {}} />
        <main className="flex-1 flex items-center justify-center p-8">
          <p className="text-gray-500 text-lg">Memuat...</p>
        </main>
      </div>
    );
  }

  // The entire JSX return block is already perfect, no changes needed.
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            Kuis Bab: {chapter?.title}
          </h1>
          <Link
            to={`/subject/${chapter?.subjectId}`}
            className="text-blue-600 hover:text-blue-800 transition duration-300 font-semibold"
          >
            &larr; Kembali ke Bab
          </Link>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {currentQuestion ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}
            </h2>
            <QuizForm
              key={quizFormKey}
              onSubmit={handleQuizSubmit}
              onClose={() => setCurrentQuestion(null)}
              initialData={currentQuestion}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Daftar Pertanyaan
            </h2>
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="p-4 border border-gray-200 rounded-lg transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-900">
                        Pertanyaan #{q.number || index + 1}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentQuestion(q)}
                          className="py-1 px-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="py-1 px-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{q.question}</p>
                    <p className="text-sm mt-2">
                      Jawaban:{" "}
                      <span className="font-semibold text-green-600">
                        {q.correctAnswer}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Belum ada pertanyaan untuk bab ini.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageQuiz;