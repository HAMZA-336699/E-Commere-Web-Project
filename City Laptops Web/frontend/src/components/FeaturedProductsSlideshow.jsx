import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function FeaturedProductsSlideshow() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await api.get('/products?featured=1');
        setProducts(data.data || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  if (loading) {
    return (
      <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="h-96 w-full animate-pulse rounded-2xl bg-white/10" />
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={currentProduct.id}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-tide/80 to-ink p-6">
            <div className="absolute -left-7 -top-7 h-28 w-28 rounded-full bg-coral/30 blur-2xl" />
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-mint/30 blur-2xl" />
            {currentProduct.images && currentProduct.images.length > 0 ? (
              <img
                src={currentProduct.images[0].url}
                alt={currentProduct.name}
                className="relative z-10 h-72 w-full rounded-xl object-cover shadow-2xl"
              />
            ) : (
              <div className="relative z-10 h-72 w-full rounded-xl bg-slate-400 flex items-center justify-center">
                <span className="text-white">No Image</span>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={prevSlide}
              className="rounded-full border border-white/20 p-3 text-mint transition hover:bg-white/10"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full border border-white/20 p-3 text-mint transition hover:bg-white/10"
            >
              →
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="mt-4 flex justify-center gap-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition ${
                  idx === currentIndex ? 'w-8 bg-mint' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`content-${currentProduct.id}`}
          className="flex flex-col justify-between"
        >
          <div>
            <span className="inline-block rounded-full border border-mint/40 bg-mint/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-mint mb-3">
              Featured
            </span>
            <h2 className="font-heading text-3xl md:text-4xl leading-tight">
              {currentProduct.name}
            </h2>
            <p className="mt-2 text-sand/80 font-semibold text-lg">
              {currentProduct.brand} {currentProduct.model}
            </p>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {currentProduct.specs?.processor && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-mint">Processor</p>
                  <p className="mt-1 font-semibold">{currentProduct.specs.processor}</p>
                </div>
              )}
              {currentProduct.specs?.ram && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-mint">RAM</p>
                  <p className="mt-1 font-semibold">{currentProduct.specs.ram}</p>
                </div>
              )}
              {currentProduct.specs?.ssd && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-mint">Storage</p>
                  <p className="mt-1 font-semibold">{currentProduct.specs.ssd}</p>
                </div>
              )}
              {currentProduct.specs?.display && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-mint">Display</p>
                  <p className="mt-1 font-semibold">{currentProduct.specs.display}</p>
                </div>
              )}
            </div>

            {currentProduct.description && (
              <p className="mt-4 text-sand/70">{currentProduct.description}</p>
            )}

            <p className="mt-6 font-heading text-3xl text-mint">
              PKR {Number(currentProduct.price).toLocaleString()}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/products/${currentProduct.id}`}
              className="rounded-xl bg-mint px-6 py-3 font-semibold text-ink transition hover:brightness-110 text-center"
            >
              View Details
            </Link>
            <Link
              to="/products"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-sand transition hover:bg-white/10 text-center"
            >
              Explore More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
