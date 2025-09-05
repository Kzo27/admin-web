import React, { useState, useEffect } from 'react';

function QuizForm({ onSubmit, onClose, initialData = null }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || '');
      setOptions(initialData.options || ['', '', '', '', '']);
      setCorrectAnswer(initialData.correctAnswer || '');
      setExplanation(initialData.explanation || '');
    } else {
      // Reset form for new entry
      setQuestion('');
      setOptions(['', '', '', '', '']);
      setCorrectAnswer('');
      setExplanation('');
    }
  }, [initialData]);
  
  // ✅ PERBAIKAN 1: Tambahkan useEffect untuk mereset jawaban benar 
  // jika opsi yang dipilih diubah atau dihapus.
  useEffect(() => {
    // Jika jawaban benar yang tersimpan saat ini sudah tidak ada lagi di dalam daftar pilihan,
    // maka reset pilihan dropdown.
    if (correctAnswer && !options.includes(correctAnswer)) {
      setCorrectAnswer('');
    }
  }, [options, correctAnswer]);


  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      question,
      options,
      correctAnswer,
      explanation,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pertanyaan</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tuliskan pertanyaan di sini..."
            required
            rows="4"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Pilihan Jawaban</label>
          <div className="space-y-2 mt-1">
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>

        {/* ✅ PERBAIKAN 2: Ubah input teks menjadi dropdown select */}
        <div>
          <label htmlFor="correct-answer" className="block text-sm font-medium text-gray-700">Jawaban Benar</label>
          <select
            id="correct-answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="" disabled>-- Pilih Jawaban Benar --</option>
            {options
              .filter(opt => opt && opt.trim() !== '') // Hanya tampilkan opsi yang sudah diisi
              .map((option, index) => (
                <option key={index} value={option}>
                  {`Opsi ${String.fromCharCode(65 + index)}: ${option}`}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pembahasan (opsional)</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Tuliskan langkah-langkah pengerjaan atau catatan di sini..."
            rows="4"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition duration-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Simpan
          </button>
        </div>
      </div>
    </form>
  );
}

export default QuizForm;
