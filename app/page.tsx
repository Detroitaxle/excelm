'use client';

import { useState } from 'react';
import { UploadModal } from '@/components/UploadModal';
import { DataGrid } from '@/components/DataGrid';
import { ExportButton } from '@/components/ExportButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const { data: rows = [], refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.data || [];
    },
  });

  const runFedexCheck = async () => {
    await fetch('/api/fedex-check', { method: 'POST' });
    refetch();
  };

  return (
    <main className="p-8 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Excelm Returns Tracker
        </h1>
        <ThemeToggle />
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setShowUpload(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload TSV
        </button>
        <button
          onClick={runFedexCheck}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Run FedEx Check
        </button>
        <ExportButton />
        <button
          onClick={() => fetch('/api/clear', { method: 'POST' }).then(() => refetch())}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete & Reupload
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-center py-16 text-gray-500">
            Upload a TSV to get started.
          </p>
        ) : (
          <DataGrid data={rows} />
        )}
      </div>

      <div className="mt-6 flex gap-6 justify-center text-sm">
        <span className="flex items-center gap-2"><div className="w-4 h-4 bg-brown-500 rounded"></div>No wh</span>
        <span className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div>Refunded</span>
        <span className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div>Closed</span>
        <span className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded"></div>Hold</span>
      </div>

      {showUpload && <UploadModal onClose={() => { setShowUpload(false); refetch(); }} />}
    </main>
  );
}
