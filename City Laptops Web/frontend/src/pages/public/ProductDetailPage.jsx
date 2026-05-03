import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [openOrder, setOpenOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [orderError, setOrderError] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    city: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    const run = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
      setActiveImage(data.data.images?.[0]?.url || '');
    };

    run();
  }, [id]);

  if (!product) {
    return <div className="mx-auto max-w-7xl px-5 py-12 text-sand/70">Loading product...</div>;
  }

  const specs = product.specs || {};

  const submitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError('');
    setOrderMessage('');

    try {
      const { data } = await api.post('/orders', {
        product_id: product.id,
        ...form,
      });

      setOrderMessage(data.message || 'Order placed successfully.');
      setForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        city: '',
        address: '',
        notes: '',
      });
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Unable to place order right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="h-[420px] w-full object-cover" />
            ) : (
              <div className="grid h-[420px] place-items-center">No Image</div>
            )}
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {(product.images || []).map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`overflow-hidden rounded-xl border ${
                  activeImage === img.url ? 'border-mint' : 'border-white/10'
                }`}
              >
                <img src={img.url} alt="thumb" className="h-20 w-24 object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-mint">{product.brand}</p>
          <h1 className="mt-2 font-heading text-4xl">{product.name}</h1>
          <p className="mt-2 text-sand/70">Model: {product.model}</p>
          <p className="mt-5 text-3xl font-semibold text-coral">PKR {Number(product.price).toLocaleString()}</p>
          <p className="mt-5 text-sand/80">{product.description}</p>

          <div className="mt-7 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
            <Spec label="RAM" value={specs.ram} />
            <Spec label="SSD" value={specs.ssd} />
            <Spec label="Processor" value={specs.processor} />
            <Spec label="Display" value={specs.display} />
          </div>

          <a
            href={`https://wa.me/923004929335?text=${encodeURIComponent(`Hi, I want to buy ${product.name}`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex rounded-xl bg-mint px-6 py-3 font-semibold text-ink hover:brightness-110"
          >
            Contact on WhatsApp
          </a>

          <Link
            to={`/checkout?product_id=${product.id}`}
            className="ml-3 mt-7 inline-flex rounded-xl border border-white/20 px-6 py-3 font-semibold text-sand transition hover:bg-white/10"
          >
            Go to Checkout
          </Link>
        </div>
      </div>

      {openOrder && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form onSubmit={submitOrder} className="w-full max-w-2xl rounded-3xl border border-white/10 bg-ink p-6 text-sand">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-mint">Checkout</p>
                <h2 className="font-heading text-3xl">Order {product.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenOrder(false)}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            {orderError && <p className="mt-4 rounded-lg bg-coral/20 p-3 text-sm text-coral">{orderError}</p>}
            {orderMessage && <p className="mt-4 rounded-lg bg-mint/20 p-3 text-sm text-mint">{orderMessage}</p>}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
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
              disabled={submitting}
              className="mt-5 rounded-xl bg-mint px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl bg-black/20 p-3">
      <p className="text-xs uppercase text-mint/80">{label}</p>
      <p className="mt-1 font-semibold">{value || 'N/A'}</p>
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
