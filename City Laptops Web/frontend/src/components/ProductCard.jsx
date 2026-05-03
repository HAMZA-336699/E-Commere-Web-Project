import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow"
    >
      {product.is_featured && (
        <div className="absolute right-0 top-0 z-10 rounded-bl-2xl bg-coral px-3 py-1 text-xs font-bold uppercase text-ink">
          Featured
        </div>
      )}
      <div className="overflow-hidden rounded-2xl bg-tide/60">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-52 place-items-center text-sm text-sand/70">No Image</div>
        )}
      </div>
      <div className="pt-4">
        <p className="text-xs uppercase tracking-wide text-mint/80">{product.brand}</p>
        <h3 className="mt-2 font-heading text-xl">{product.name}</h3>
        <p className="mt-1 text-sm text-sand/70">{product.model}</p>
        <p className="mt-3 text-lg font-semibold text-coral">PKR {Number(product.price).toLocaleString()}</p>
        <Link
          to={`/products/${product.id}`}
          className="mt-4 inline-flex rounded-xl bg-mint px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
