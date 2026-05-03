import { Link, NavLink, Outlet } from 'react-router-dom';

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm transition ${
          isActive ? 'bg-mint text-ink' : 'text-sand/80 hover:text-sand'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1a3b4d_0%,_#0a141b_45%,_#081015_100%)] text-sand font-body">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/70 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-heading text-2xl tracking-tight text-mint">
            City Laptops
          </Link>
          <div className="flex items-center gap-2">
            <NavItem to="/" label="Home" />
            <NavItem to="/products" label="Shop" />
            <NavItem to="/checkout" label="Checkout" />
            <NavItem to="/contact" label="Contact" />
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-sand/70 md:flex-row md:justify-between">
          <p>City Laptops - Premium Laptop Store</p>
          <p>Phone/WhatsApp: +923004929335</p>
        </div>
      </footer>
    </div>
  );
}
