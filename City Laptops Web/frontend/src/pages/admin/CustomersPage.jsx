import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../api/axios';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/customers?datatable=1');
      setCustomers(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    { name: 'Name', selector: (row) => row.customer_name, sortable: true },
    { name: 'Email', selector: (row) => row.customer_email, sortable: true, grow: 2 },
    { name: 'Phone', selector: (row) => row.customer_phone },
    { name: 'City', selector: (row) => row.city },
    { name: 'Orders', selector: (row) => Number(row.total_orders || 0), sortable: true, width: '90px' },
    {
      name: 'Last Order',
      selector: (row) => (row.last_order_at ? new Date(row.last_order_at).toLocaleDateString() : '-'),
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-heading text-4xl">Users Who Ordered</h1>
        <button onClick={fetchCustomers} className="rounded-xl bg-ink px-4 py-3 font-semibold text-sand">
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <DataTable
          columns={columns}
          data={customers}
          pagination
          progressPending={loading}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
}
