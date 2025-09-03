import React from 'react';

function ChapterDetailView({ chapter, onClose }) {
  if (!chapter) {
    return null;
  }

  // ▼▼▼ FIX: Use the dynamic environment variable instead of a hardcoded URL ▼▼▼
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
      <p className="text-gray-600 mb-4 text-justify">{chapter.description}</p>
      
      {/* Tampilkan video jika videoUrl ada */}
      {chapter.videoUrl && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Video Materi:</h4>
          <video 
            // This now uses the dynamic BACKEND_URL
            src={`${BACKEND_URL}/uploads/videos/${chapter.videoUrl}`}
            controls
            className="w-full max-h-96 rounded-lg shadow-md bg-black"
          />
        </div>
      )}

      {/* Tampilkan file dokumen jika documentUrl ada */}
      {chapter.documentUrl && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Dokumen Pendukung:</h4>
          <a
            // This also uses the dynamic BACKEND_URL
            href={`${BACKEND_URL}/uploads/documents/${chapter.documentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download Dokumen
          </a>
        </div>
      )}

    </div>
  );
}

export default ChapterDetailView;
