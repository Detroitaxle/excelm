'use client';
import { Download } from 'lucide-react';
import { useState } from 'react';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const res = await fetch('/api/orders');
    const { data } = await res.json();
    const csv = data.map((row: any) => [
      row.order_id, row.order_date, row.return_request_date, row.label_cost,
      row.return_carrier, row.tracking_id, row.merchant_sku, row.order_amount,
      JSON.stringify(row.fedex_status), row.manual_status
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `excelm-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    setIsExporting(false);
  };

  return (
    <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
      <Download className="w-4 h-4" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}
