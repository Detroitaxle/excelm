'use client';
import { useState } from 'react';
import DataGrid from 'react-data-grid';

const columns = [
  { key: 'selection', name: '', width: 50, frozen: true },
  { key: 'order_id', name: 'Order ID', width: 120 },
  { key: 'order_date', name: 'Order Date', width: 120 },
  { key: 'return_request_date', name: 'Return Request Date', width: 140 },
  { key: 'label_cost', name: 'Label Cost', width: 100 },
  { key: 'return_carrier', name: 'Return Carrier', width: 120 },
  { key: 'tracking_id', name: 'Tracking ID', width: 140 },
  { key: 'merchant_sku', name: 'Merchant SKU', width: 120 },
  { key: 'order_amount', name: 'Order Amount', width: 120 },
  { key: 'fedex_status', name: 'FedEx Info', width: 150 },
  { key: 'manual_status', name: 'Manual Action', width: 120, editable: true },
];

export function DataGrid({ data }: { data: any[] }) {
  const [rows, setRows] = useState(data);

  const getRowClass = (row: any) => {
    switch (row.manual_status) {
      case 'No wh': return 'bg-amber-100 dark:bg-amber-900';
      case 'Refunded': return 'bg-green-100 dark:bg-green-900';
      case 'Closed': return 'bg-red-100 dark:bg-red-900';
      case 'Hold': return 'bg-orange-100 dark:bg-orange-900';
      default: return '';
    }
  };

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      onRowsChange={setRows}
      rowClass={(row) => getRowClass(row)}
      defaultColumnOptions={{ resizable: true, sortable: true }}
      enableVirtualization
    />
  );
}
