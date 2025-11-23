'use client';
import RDG from 'react-data-grid';           // renamed import
import 'react-data-grid/lib/styles.css';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, Filter, Trash2 } from 'lucide-react';

// Helper function to extract readable FedEx result from JSONB
function getFedExResult(fedexStatus: any): string {
  // Return empty string if no status (not checked yet)
  if (!fedexStatus) return '';
  
  // If there's an error
  if (fedexStatus.error) {
    return `Error: ${fedexStatus.error}`;
  }
  
  // Try to extract key information from FedEx response
  try {
    const str = JSON.stringify(fedexStatus).toLowerCase();
    
    // Check for delivery status
    if (str.includes('delivered') || str.includes('dl')) {
      return 'Delivered';
    }
    
    // Check for in transit
    if (str.includes('transit') || str.includes('in transit')) {
      return 'In Transit';
    }
    
    // Check for pending
    if (str.includes('pending') || str.includes('label created')) {
      return 'Pending';
    }
    
    // Return a truncated version of the status
    const statusStr = JSON.stringify(fedexStatus);
    return statusStr.length > 50 ? statusStr.substring(0, 50) + '...' : statusStr;
  } catch {
    return '';
  }
}

const columns = [
  { key: 'order_id', name: 'Order ID', width: 120 },
  { key: 'order_date', name: 'Order Date', width: 110 },
  { key: 'return_request_date', name: 'Return Date', width: 110 },
  { key: 'label_cost', name: 'Label Cost', width: 90 },
  { key: 'return_carrier', name: 'Carrier', width: 100 },
  { key: 'tracking_id', name: 'Tracking ID', width: 150 },
  { key: 'merchant_sku', name: 'SKU', width: 120 },
  { key: 'order_amount', name: 'Amount', width: 100 },
  {
    key: 'fedex_result',
    name: 'FedEx Result',
    width: 200,
    formatter: ({ row }: any) => {
      const result = getFedExResult(row.fedex_status);
      return <div className="px-2 py-1 text-sm">{result}</div>;
    }
  },
  {
    key: 'agent_action',
    name: 'Agent Action',
    width: 160,
    editable: true,
    editor: ({ row, onRowChange }: any) => (
      <select
        value={row.agent_action || ''}
        onChange={(e) => onRowChange({ ...row, agent_action: e.target.value })}
        className="w-full px-2 py-1"
      >
        <option value="">—</option>
        <option value="refunded">Refunded</option>
        <option value="closed">Closed</option>
        <option value="no wh">No wh</option>
        <option value="replacement requested">Replacement Requested</option>
        <option value="hold">Hold</option>
      </select>
    ),
    formatter: ({ row }: any) => {
      const colors: any = {
        'refunded': 'bg-green-500',
        'closed': 'bg-red-500',
        'no wh': 'bg-amber-500',
        'replacement requested': 'bg-blue-500',
        'hold': 'bg-orange-500',
      };
      const color = colors[row.agent_action] || 'bg-gray-300';
      return <div className={`w-full text-center text-white py-1 rounded ${color}`}>{row.agent_action || '—'}</div>;
    }
  },
];

type Filter = {
  columnKey: string;
  value: string;
};

export function DataGrid({ data, onDeleteRows, onRefetch, onSelectedRowsChange, onRunFedExCheck }: { 
  data: any[]; 
  onDeleteRows?: (ids: number[]) => Promise<void>; 
  onRefetch?: () => void;
  onSelectedRowsChange?: (ids: number[]) => void;
  onRunFedExCheck?: (ids: number[]) => Promise<void>;
}) {
  const [rows, setRows] = useState(data);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Update local state when data prop changes
  useEffect(() => {
    setRows(data);
  }, [data]);

  // Get unique values for filter dropdowns
  const getUniqueValues = useCallback((columnKey: string) => {
    const values = new Set<string>();
    rows.forEach(row => {
      const value = row[columnKey];
      if (value !== null && value !== undefined && value !== '') {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  }, [rows]);

  // Apply filters to rows
  const filteredRows = useMemo(() => {
    if (filters.length === 0) return rows;
    
    return rows.filter(row => {
      return filters.every(filter => {
        const cellValue = String(row[filter.columnKey] || '').toLowerCase();
        const filterValue = filter.value.toLowerCase();
        return cellValue.includes(filterValue);
      });
    });
  }, [rows, filters]);

  const handleRowsChange = useCallback(async (newRows: any[], indexes: { from: number; to: number }[]) => {
    setRows(newRows);
    
    // Save changes to database
    for (const { from } of indexes) {
      const row = newRows[from];
      const originalRow = data[from];
      
      // Only update if agent_action changed
      if (row.agent_action !== originalRow?.agent_action) {
        try {
          await fetch(`/api/orders/${row.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_action: row.agent_action }),
          });
        } catch (error) {
          console.error('Failed to update agent_action:', error);
        }
      }
    }
  }, [data]);

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [columnKey]: value }));
    
    if (value.trim() === '') {
      setFilters(prev => prev.filter(f => f.columnKey !== columnKey));
    } else {
      setFilters(prev => {
        const existing = prev.find(f => f.columnKey === columnKey);
        if (existing) {
          existing.value = value;
          return [...prev];
        }
        return [...prev, { columnKey, value }];
      });
    }
  };

  const clearFilters = () => {
    setFilters([]);
    setFilterValues({});
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedRows.size} row(s)?`)) {
      const ids = Array.from(selectedRows);
      if (onDeleteRows) {
        await onDeleteRows(ids);
      } else {
        // Fallback: delete via API
        await Promise.all(ids.map(id => 
          fetch(`/api/orders/${id}`, { method: 'DELETE' })
        ));
      }
      setSelectedRows(new Set());
      if (onRefetch) onRefetch();
    }
  };

  const handleRowSelection = (rowId: number, checked: boolean) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }
      // Notify parent of selection changes
      if (onSelectedRowsChange) {
        onSelectedRowsChange(Array.from(next));
      }
      return next;
    });
  };

  const handleRunFedExCheck = async () => {
    if (selectedRows.size === 0) {
      alert('Please select rows to check');
      return;
    }
    const ids = Array.from(selectedRows);
    if (onRunFedExCheck) {
      await onRunFedExCheck(ids);
    }
  };

  // Add selection column
  const columnsWithSelection = [
    {
      key: 'select',
      name: '',
      width: 50,
      formatter: ({ row }: any) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={(e) => handleRowSelection(row.id, e.target.checked)}
          className="cursor-pointer"
        />
      )
    },
    ...columns
  ];

  return (
    <div className="w-full">
      {/* Filter and Action Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
              showFilters ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters {filters.length > 0 && `(${filters.length})`}
          </button>
          {filters.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
          {selectedRows.size > 0 && (
            <>
              <button
                onClick={handleRunFedExCheck}
                className="px-3 py-1 rounded text-sm bg-green-500 text-white flex items-center gap-1"
              >
                Run FedEx Check ({selectedRows.size})
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 rounded text-sm bg-red-500 text-white flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete {selectedRows.size} row(s)
              </button>
            </>
          )}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredRows.length} of {rows.length} rows
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {columns.map(col => (
            <div key={col.key} className="flex flex-col">
              <label className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">{col.name}</label>
              <input
                type="text"
                value={filterValues[col.key] || ''}
                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                placeholder="Filter..."
                className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          ))}
        </div>
      )}

      {/* Data Grid */}
      <RDG
        columns={columnsWithSelection}
        rows={filteredRows}
        rowKeyGetter={(row) => row.id}
        onRowsChange={handleRowsChange}
        className="rdg-light"
        style={{ height: 'calc(100vh - 400px)' }}
        rowClass={(row) => {
          // Color code entire row based on agent_action
          const rowColors: any = {
            'refunded': 'bg-green-50 dark:bg-green-900/20',
            'closed': 'bg-red-50 dark:bg-red-900/20',
            'no wh': 'bg-amber-50 dark:bg-amber-900/20',
            'replacement requested': 'bg-blue-50 dark:bg-blue-900/20',
            'hold': 'bg-orange-50 dark:bg-orange-900/20',
          };
          return rowColors[row.agent_action] || '';
        }}
      />
    </div>
  );
}
