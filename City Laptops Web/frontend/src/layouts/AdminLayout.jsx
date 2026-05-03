import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-sand text-ink font-body">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="bg-ink px-6 py-8 text-sand">
          <Link to="/admin" className="font-heading text-2xl text-mint">
            City Laptops
          </Link>
          <p className="mt-2 text-sm text-sand/70">Admin Panel</p>
          <div className="mt-8 space-y-2">
            <NavLink to="/admin" end className="block rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10">
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className="block rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10">
              Products
            </NavLink>
            <NavLink to="/admin/orders" className="block rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10">
              Orders
            </NavLink>
            <NavLink to="/admin/order-items" className="block rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10">
              Order Items
            </NavLink>
            <NavLink to="/admin/customers" className="block rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10">
              Users Ordered
            </NavLink>
            <NavLink to="/admin/admins" className="block rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10">
              Admins
            </NavLink>
          </div>
          <div className="mt-10 rounded-xl border border-white/10 p-4 text-sm">
            <p className="text-sand/60">Signed in as</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-5 w-full rounded-xl bg-coral px-4 py-3 font-semibold text-ink transition hover:brightness-110"
          >
            Logout
          </button>
        </aside>
        <section className="px-4 py-6 md:px-8">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
