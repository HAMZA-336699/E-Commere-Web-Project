import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeaturedProductsSlideshow from '../../components/FeaturedProductsSlideshow';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-4 inline-block rounded-full border border-mint/40 bg-mint/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-mint">
            City Laptops
          </p>
          <h1 className="font-heading text-4xl leading-tight md:text-6xl">
            Professional Laptops for Work, Gaming and Creativity
          </h1>
          <p className="mt-6 max-w-xl text-sand/80">
            Explore premium Dell and HP machines curated for performance, reliability, and design. Get quick support on WhatsApp and fast delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="rounded-xl bg-mint px-6 py-3 font-semibold text-ink transition hover:brightness-110">
              Explore Collection
            </Link>
            <a
              href="https://wa.me/923004929335"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-sand transition hover:bg-white/10"
            >
              WhatsApp Us
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-tide/80 to-ink p-8"
        >
          <div className="absolute -left-7 -top-7 h-28 w-28 rounded-full bg-coral/30 blur-2xl" />
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-mint/30 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
            alt="Laptop showcase"
            className="relative z-10 h-72 w-full rounded-2xl object-cover shadow-2xl"
          />
        </motion.div>
      </section>
      <FeaturedProductsSlideshow />
      <section className="mt-16 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-mint">Store Name</p>
          <p className="mt-1 font-heading text-2xl">City Laptops</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-mint">Support</p>
          <p className="mt-1 font-heading text-2xl">+923004929335</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-mint">Brands</p>
          <p className="mt-1 font-heading text-2xl">Dell, HP</p>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        <FeatureCard title="1 Year Warranty" text="Every machine includes warranty coverage and service guidance from City Laptops." />
        <FeatureCard title="Delivery Nationwide" text="Fast shipping across Pakistan with secure packaging and order tracking support." />
        <FeatureCard title="Business Consultation" text="Need laptops for office teams? Get tailored bulk recommendations from our experts." />
      </section>

      <section className="mt-14 grid gap-5 rounded-3xl border border-white/10 bg-black/20 p-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-mint">Why City Laptops</p>
          <h2 className="mt-2 font-heading text-3xl">A premium buying experience, not just a product list.</h2>
          <p className="mt-4 text-sand/75">
            We focus on clarity, trust and after-sales support. Each listing is curated with practical specs so you can compare confidently and buy quickly.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl border border-white/20 px-5 py-3 font-semibold text-sand transition hover:bg-white/10"
          >
            Browse Inventory
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatTile label="Devices Listed" value="50+" />
          <StatTile label="Satisfied Buyers" value="2k+" />
          <StatTile label="Average Response" value="5 min" />
          <StatTile label="Support Days" value="7 / week" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="font-heading text-2xl">{title}</h3>
      <p className="mt-2 text-sand/75">{text}</p>
    </article>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-mint/90">{label}</p>
      <p className="mt-2 font-heading text-3xl">{value}</p>
    </div>
  );
}
