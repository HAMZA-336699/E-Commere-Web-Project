import { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../api/axios';

const colors = ['#77FFC2', '#FF8B6A', '#0E2A38'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const run = async () => {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    };

    run();
  }, []);

  if (!stats) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  const brandData = Object.entries(stats.by_brand || {}).map(([name, value]) => ({ name, value }));
  const priceData = Object.entries(stats.by_price_range || {}).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h1 className="font-heading text-4xl">Dashboard Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" value={stats.total_products} />
        <StatCard title="Total Categories" value={stats.total_categories} />
        <StatCard title="Brands Active" value={brandData.length} />
        <StatCard title="Total Orders" value={stats.total_orders || 0} />
        <StatCard title="Pending Orders" value={stats.pending_orders || 0} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-heading text-2xl">Products by Brand</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={brandData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {brandData.map((entry, idx) => (
                    <Cell key={entry.name} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-heading text-2xl">Products by Price Range</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0E2A38" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-4">
        <h2 className="font-heading text-2xl">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Order #</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Product</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recent_orders || []).map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 font-semibold">#{order.id}</td>
                  <td className="py-2">{order.customer_name}</td>
                  <td className="py-2">{order.product_name}</td>
                  <td className="py-2 capitalize">{order.status}</td>
                  <td className="py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 font-heading text-4xl">{value}</h3>
    </div>
  );
}
