import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const email = useMemo(() => params.get('email') || '', [params]);

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(data.message || 'Password reset successful.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(140deg,#071017,#0f2f3f)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 text-sand">
        <h1 className="font-heading text-3xl">Reset Admin Password</h1>
        <p className="mt-2 text-sm text-sand/70">Account: {email}</p>

        {error && <p className="mt-4 rounded-lg bg-coral/20 p-3 text-sm text-coral">{error}</p>}
        {message && <p className="mt-4 rounded-lg bg-mint/20 p-3 text-sm text-mint">{message}</p>}

        <label className="mt-5 block text-sm">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-mint"
          required
        />

        <label className="mt-4 block text-sm">Confirm Password</label>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-mint"
          required
        />

        <button
          type="submit"
          disabled={loading || !token || !email}
          className="mt-6 w-full rounded-xl bg-mint px-4 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <Link to="/admin/login" className="mt-4 inline-block text-sm text-sand/80 underline underline-offset-4">
          Back to Login
        </Link>
      </form>
    </div>
  );
}
