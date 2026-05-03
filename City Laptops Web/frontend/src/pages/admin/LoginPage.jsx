import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async () => {
    setForgotMessage('');
    setError('');

    if (!form.email) {
      setError('Please enter admin email first.');
      return;
    }

    setForgotLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email: form.email });
      setForgotMessage(data.message || 'Reset link sent to email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(120deg,#081015,#0f2f3f)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 text-sand shadow-glow">
        <h1 className="font-heading text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-sand/70">Use your City Laptops admin credentials.</p>

        {error && <p className="mt-4 rounded-lg bg-coral/20 p-3 text-sm text-coral">{error}</p>}
        {forgotMessage && <p className="mt-4 rounded-lg bg-mint/20 p-3 text-sm text-mint">{forgotMessage}</p>}

        <label className="mt-5 block text-sm">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-mint"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label className="mt-4 block text-sm">Password</label>
        <div className="relative mt-2">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 pr-20 outline-none focus:border-mint"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-sand/90 hover:bg-white/10"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-mint px-4 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          className="mt-3 w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-sand/90 transition hover:bg-white/10 disabled:opacity-60"
        >
          {forgotLoading ? 'Sending...' : 'Forgot Password'}
        </button>
      </form>
    </div>
  );
}
