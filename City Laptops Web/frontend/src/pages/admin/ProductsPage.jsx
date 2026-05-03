import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../api/axios';
import ProductFormModal from '../../components/admin/ProductFormModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data.data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitForm = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        payload.append('_method', 'PUT');
        await api.post(`/products/${editing.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setOpen(false);
      setEditing(null);
      await fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (product) => {
    const approved = window.confirm(`Delete ${product.name}?`);
    if (!approved) return;
    await api.delete(`/products/${product.id}`);
    await fetchProducts();
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Brand',
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: 'Model',
      selector: (row) => row.model,
    },
    {
      name: 'Price',
      selector: (row) => `PKR ${Number(row.price).toLocaleString()}`,
      sortable: true,
    },
    {
      name: 'Featured',
      cell: (row) => (
        <div className="flex items-center justify-center">
          {row.is_featured ? (
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">✓ Yes</span>
          ) : (
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">✗ No</span>
          )}
        </div>
      ),
      sortable: true,
      center: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditing(row);
              setOpen(true);
            }}
            className="rounded-lg bg-ink px-3 py-2 text-xs text-sand"
          >
            Edit
          </button>
          <button onClick={() => removeProduct(row)} className="rounded-lg bg-coral px-3 py-2 text-xs font-semibold">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-heading text-4xl">Manage Products</h1>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-xl bg-ink px-4 py-3 font-semibold text-sand"
        >
          Add New Product
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <DataTable columns={columns} data={products} pagination highlightOnHover responsive />
      </div>

      <ProductFormModal
        open={open}
        initialData={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={submitForm}
        saving={saving}
      />
    </div>
  );
}
