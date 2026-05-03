import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../api/axios';

const statusOptions = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (row, status) => {
    if (status === row.status) return;
    await api.post(`/orders/${row.id}/status`, { status });
    await fetchOrders();
  };

  const columns = [
    { name: 'Order #', selector: (row) => row.id, sortable: true, width: '90px' },
    { name: 'Customer', selector: (row) => row.customer_name, sortable: true },
    { name: 'Phone', selector: (row) => row.customer_phone },
    { name: 'Product', selector: (row) => row.product_name, grow: 2 },
    { name: 'City', selector: (row) => row.city },
    {
      name: 'Status',
      cell: (row) => (
        <select
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
          value={row.status}
          onChange={(e) => updateStatus(row, e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-heading text-4xl">Customer Orders</h1>
        <button onClick={fetchOrders} className="rounded-xl bg-ink px-4 py-3 font-semibold text-sand">
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <DataTable
          columns={columns}
          data={orders}
          pagination
          progressPending={loading}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
}
