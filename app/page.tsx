'use client';
import { useState } from 'react';
import { DataGrid } from '@/components/DataGrid';
import { UploadModal } from '@/components/UploadModal';
import { ExportButton } from '@/components/ExportButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const [isRunningFedex, setIsRunningFedex] = useState(false);
  const { data: orders } = useQuery({ 
    queryKey: ['orders'], 
    queryFn: () => fetch('/api/orders').then(r => r.json()) 
  });

  const handleRunFedex = async () => {
    setIsRunningFedex(true);
    await fetch('/api/run-fedex-check', { method: 'POST', body: JSON.stringify({ batchSize: 200 }) });
    setIsRunningFedex(false);
  };

  const handleDeleteAll = async () => {
    if (confirm('Delete all data?')) {
      await fetch('/api/orders', { method: 'DELETE' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Excelm Returns Tracker</h1>
        
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Upload TSV</button>
          <button onClick={handleRunFedex} disabled={isRunningFedex} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">
            {isRunningFedex ? 'Running...' : 'Run FedEx Check'}
          </button>
          <ExportButton />
          <button onClick={handleDeleteAll} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete & Reupload</button>
          <ThemeToggle />
        </div>

        <div className="flex gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-200 dark:bg-amber-900 rounded"></div> No wh</span>
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-green-200 dark:bg-green-900 rounded"></div> Refunded</span>
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-red-200 dark:bg-red-900 rounded"></div> Closed</span>
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-200 dark:bg-orange-900 rounded"></div> Hold</span>
        </div>

        {orders?.data?.length > 0 ? <DataGrid data={orders.data} /> : <p className="text-gray-500">Upload a TSV to get started.</p>}

        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </div>
    </main>
  );
}
