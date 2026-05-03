import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    product_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    city: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    const run = async () => {
      setLoadingProducts(true);
      try {
        const { data } = await api.get('/products');
        const list = data.data || [];
        setProducts(list);

        const queryProductId = searchParams.get('product_id');
        if (queryProductId && list.some((item) => String(item.id) === String(queryProductId))) {
          setForm((prev) => ({ ...prev, product_id: queryProductId }));
        } else if (list[0]) {
          setForm((prev) => ({ ...prev, product_id: String(list[0].id) }));
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    run();
  }, [searchParams]);

  const selectedProduct = useMemo(
    () => products.find((item) => String(item.id) === String(form.product_id)),
    [products, form.product_id]
  );

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...form,
        product_id: Number(form.product_id),
      };

      const { data } = await api.post('/orders', payload);
      setMessage(data.message || 'Order placed successfully.');
      setForm((prev) => ({
        ...prev,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        city: '',
        address: '',
        notes: '',
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-mint">Secure Order</p>
      <h1 className="mt-2 font-heading text-4xl">Checkout</h1>
      <p className="mt-2 text-sand/75">Fill your details and we will confirm your order by phone.</p>

      <form onSubmit={submit} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        {message && <p className="mb-4 rounded-xl bg-mint/20 p-3 text-sm text-mint">{message}</p>}
        {error && <p className="mb-4 rounded-xl bg-coral/20 p-3 text-sm text-coral">{error}</p>}

        <div>
          <label className="text-sm">Select Product</label>
          <select
            value={form.product_id}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-mint"
            required
            disabled={loadingProducts}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - PKR {Number(product.price).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wide text-mint">Selected Item</p>
            <p className="mt-1 font-semibold">{selectedProduct.name}</p>
            <p className="text-sm text-sand/70">{selectedProduct.brand} {selectedProduct.model}</p>
            <p className="mt-1 text-coral">PKR {Number(selectedProduct.price).toLocaleString()}</p>
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="Your Name" value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} />
          <Field label="Email" type="email" value={form.customer_email} onChange={(v) => setForm({ ...form, customer_email: v })} />
          <Field label="Phone" value={form.customer_phone} onChange={(v) => setForm({ ...form, customer_phone: v })} />
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        </div>

        <label className="mt-3 block text-sm">Address</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-mint"
          rows={2}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />

        <label className="mt-3 block text-sm">Notes (optional)</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-mint"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button
          type="submit"
          disabled={submitting || loadingProducts}
          className="mt-5 rounded-xl bg-mint px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-mint"
        required
      />
    </div>
  );
}
