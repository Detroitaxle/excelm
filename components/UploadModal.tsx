'use client';
import { useState } from 'react';
import Papa from 'papaparse';

export function UploadModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('tsv', file);
    await fetch('/api/upload-tsv', { method: 'POST', body: formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".tsv,.txt" />
        <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
        <button onClick={onClose} className="ml-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
      </div>
    </div>
  );
}
