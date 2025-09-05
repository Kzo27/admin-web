import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; // Ensure this import path is correct
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ✅ PERBAIKAN 1: Fungsi untuk membuat ID unik sederhana
const generateUniqueId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

function CreateTryOut() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([
    {
      // ✅ PERBAIKAN 2: Tambahkan ID pada pertanyaan pertama
      id: generateUniqueId(),
      question: "",
      options: ["", "", "", "", ""],
      correctAnswer: "",
      explanation: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // ... (handleQuestionChange dan handleOptionChange tidak perlu diubah) ...
  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };


  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        // ✅ PERBAIKAN 3: Tambahkan ID saat menambah pertanyaan baru
        id: generateUniqueId(),
        question: "",
        options: ["", "", "", "", ""],
        correctAnswer: "",
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      questions.some(
        (q) =>
          !q.question ||
          !q.correctAnswer ||
          q.options.some((opt) => !opt.trim())
      )
    ) {
      MySwal.fire(
        "Error",
        "Semua pertanyaan dan opsi jawaban harus diisi.",
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      // ✅ PERBAIKAN 4: Pastikan field 'id' juga ikut terkirim
      // Tidak perlu ada perubahan di sini, karena 'questions' sudah mengandung 'id'
      const tryoutData = { title, description, duration, questions };
      await api.post("/api/v1/tryouts", tryoutData);
      MySwal.fire("Berhasil!", "Paket Try Out berhasil dibuat!", "success");
      navigate("/tryouts");
    } catch (err) {
      MySwal.fire(
        "Gagal",
        err.response?.data?.message ||
          "Terjadi kesalahan saat membuat Try Out.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (Seluruh bagian JSX/HTML tidak perlu diubah sama sekali) ...
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar onLogout={logout} onClose={() => {}} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Buat Paket Try Out Baru
          </h1>
          <Link
            to="/tryouts"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            &larr; Kembali
          </Link>
        </header>
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Detail Try Out
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Judul Try Out
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contoh: Try Out UTBK 2025"
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Deskripsi
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsi singkat tentang paket try out ini."
                        required
                        rows="4"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Durasi (menit)
                      </label>
                      <input
                        id="duration"
                        type="number"
                        value={duration}
                        min="1"
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Durasi (menit)"
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:border-l lg:border-gray-200 lg:pl-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Buat Pertanyaan
                  </h2>
                  <div className="space-y-6">
                    {questions.map((q, qIndex) => (
                      <div
                        // ✅ PERBAIKAN 5: Gunakan ID unik sebagai 'key' untuk performa lebih baik
                        key={q.id}
                        className="bg-gray-50 p-6 rounded-md border border-gray-200 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            Pertanyaan #{qIndex + 1}
                          </h3>
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor={`question-${qIndex}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Pertanyaan
                            </label>
                            <textarea
                              id={`question-${qIndex}`}
                              value={q.question}
                              onChange={(e) =>
                                handleQuestionChange(
                                  qIndex,
                                  "question",
                                  e.target.value
                                )
                              }
                              rows="3"
                              required
                              placeholder="Tuliskan pertanyaan di sini..."
                              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Pilihan Jawaban
                            </label>
                            <div className="space-y-2 mt-1">
                              {q.options.map((option, oIndex) => (
                                <input
                                  key={oIndex}
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      qIndex,
                                      oIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Opsi ${String.fromCharCode(
                                    65 + oIndex
                                  )}`}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor={`correct-answer-${qIndex}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Jawaban Benar
                            </label>
                            <select
                              id={`correct-answer-${qIndex}`}
                              value={q.correctAnswer}
                              onChange={(e) =>
                                handleQuestionChange(
                                  qIndex,
                                  "correctAnswer",
                                  e.target.value
                                )
                              }
                              required
                              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">
                                -- Pilih Jawaban Benar --
                              </option>
                              {q.options
                                .filter((opt) => opt.trim() !== "")
                                .map((option, oIndex) => (
                                  <option key={oIndex} value={option}>
                                    {`Opsi ${String.fromCharCode(
                                      65 + oIndex
                                    )} (${option})`}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-md hover:bg-gray-100 hover:border-gray-400 transition"
                    >
                      + Tambah Pertanyaan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <button
              type="submit"
              className={`w-full py-3 px-4 text-white font-semibold rounded-md transition duration-300 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Simpan Paket Try Out"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTryOut;
