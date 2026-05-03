import { useState } from 'react';
import api from '../../api/axios';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.post('/contact', form);
      setMessage(data.message || 'Message sent successfully.');
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-mint">Get In Touch</p>
      <h1 className="mt-2 font-heading text-4xl">Contact Us</h1>
      <p className="mt-2 text-sand/75">Share your question and our team will respond shortly.</p>

      <form onSubmit={submit} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        {message && <p className="mb-4 rounded-xl bg-mint/20 p-3 text-sm text-mint">{message}</p>}
        {error && <p className="mb-4 rounded-xl bg-coral/20 p-3 text-sm text-coral">{error}</p>}

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Your Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone (optional)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required={false} />
          <Field label="Subject (optional)" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required={false} />
        </div>

        <label className="mt-3 block text-sm">Message</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-mint"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 rounded-xl bg-mint px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = true }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-mint"
        required={required}
      />
    </div>
  );
}
