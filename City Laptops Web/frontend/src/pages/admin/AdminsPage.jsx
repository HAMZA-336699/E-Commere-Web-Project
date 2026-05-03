import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../api/axios';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admins?datatable=1');
      setAdmins(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = [
    { name: 'ID', selector: (row) => row.id, sortable: true, width: '80px' },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true, grow: 2 },
    {
      name: 'Created',
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'),
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-heading text-4xl">Admins</h1>
        <button onClick={fetchAdmins} className="rounded-xl bg-ink px-4 py-3 font-semibold text-sand">
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <DataTable
          columns={columns}
          data={admins}
          pagination
          progressPending={loading}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
}
