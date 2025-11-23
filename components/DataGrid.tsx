'use client';
import RDG from 'react-data-grid';           // renamed import
import 'react-data-grid/lib/styles.css';

const columns = [
  { key: 'order_id', name: 'Order ID', width: 120 },
  { key: 'order_date', name: 'Order Date', width: 110 },
  { key: 'return_request_date', name: 'Return Date', width: 110 },
  { key: 'label_cost', name: 'Label Cost', width: 90 },
  { key: 'return_carrier', name: 'Carrier', width: 100 },
  { key: 'tracking_id', name: 'Tracking ID', width: 150 },
  { key: 'merchant_sku', name: 'SKU', width: 120 },
  { key: 'order_amount', name: 'Amount', width: 100 },
  { key: 'fedex_status', name: 'FedEx Status', width: 200 },
  {
    key: 'manual_status',
    name: 'Manual Action',
    width: 140,
    editable: true,
    editor: ({ row, onRowChange }: any) => (
      <select
        value={row.manual_status || ''}
        onChange={(e) => onRowChange({ ...row, manual_status: e.target.value })}
        className="w-full px-2 py-1"
      >
        <option value="">—</option>
        <option value="No wh">No wh</option>
        <option value="Refunded">Refunded</option>
        <option value="Closed">Closed</option>
        <option value="Hold">Hold</option>
      </select>
    ),
    formatter: ({ row }: any) => {
      const colors: any = {
        'No wh': 'bg-brown-500',
        'Refunded': 'bg-green-500',
        'Closed': 'bg-red-500',
        'Hold': 'bg-orange-500',
      };
      const color = colors[row.manual_status] || 'bg-gray-300';
      return <div className={`w-full text-center text-white py-1 rounded ${color}`}>{row.manual_status || '—'}</div>;
    }
  },
];

export function DataGrid({ data }: { data: any[] }) {
  return (
    <RDG
      columns={columns}
      rows={data}
      rowKeyGetter={(row) => row.id}
      className="rdg-light"
      style={{ height: 'calc(100vh - 300px)' }}
    />
  );
}
