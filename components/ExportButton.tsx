'use client';
import { Download } from 'lucide-react';
import { useState } from 'react';

// Helper function to extract readable FedEx result from JSONB
function getFedExResult(fedexStatus: any): string {
  if (!fedexStatus) return '—';
  
  if (fedexStatus.error) {
    return `Error: ${fedexStatus.error}`;
  }
  
  try {
    const str = JSON.stringify(fedexStatus).toLowerCase();
    
    if (str.includes('delivered') || str.includes('dl')) {
      return 'Delivered';
    }
    
    if (str.includes('transit') || str.includes('in transit')) {
      return 'In Transit';
    }
    
    if (str.includes('pending') || str.includes('label created')) {
      return 'Pending';
    }
    
    return JSON.stringify(fedexStatus);
  } catch {
    return '—';
  }
}

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const res = await fetch('/api/orders');
    const { data } = await res.json();
    
    // CSV header
    const headers = [
      'Order ID', 'Order Date', 'Return Date', 'Label Cost', 'Carrier', 
      'Tracking ID', 'SKU', 'Amount', 'FedEx Result', 'Agent Action'
    ];
    
    const csv = [
      headers.map(h => `"${h}"`).join(','),
      ...data.map((row: any) => [
        row.order_id, row.order_date, row.return_request_date, row.label_cost,
        row.return_carrier, row.tracking_id, row.merchant_sku, row.order_amount,
        getFedExResult(row.fedex_status), row.agent_action || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
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
