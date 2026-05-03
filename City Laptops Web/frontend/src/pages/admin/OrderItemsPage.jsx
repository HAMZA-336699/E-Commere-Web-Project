import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../api/axios';

export default function OrderItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/order-items?datatable=1');
      setItems(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const columns = [
    { name: 'Item #', selector: (row) => row.id, sortable: true, width: '90px' },
    { name: 'Order #', selector: (row) => row.order_id, sortable: true, width: '100px' },
    { name: 'Product', selector: (row) => row.product_name, grow: 2 },
    { name: 'Brand', selector: (row) => row.product_brand },
    { name: 'Model', selector: (row) => row.product_model },
    { name: 'Qty', selector: (row) => row.quantity, sortable: true, width: '80px' },
    { name: 'Unit Price', selector: (row) => `PKR ${Number(row.unit_price).toLocaleString()}` },
    { name: 'Line Total', selector: (row) => `PKR ${Number(row.line_total).toLocaleString()}` },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-heading text-4xl">Order Items</h1>
        <button onClick={fetchItems} className="rounded-xl bg-ink px-4 py-3 font-semibold text-sand">
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <DataTable
          columns={columns}
          data={items}
          pagination
          progressPending={loading}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
}
