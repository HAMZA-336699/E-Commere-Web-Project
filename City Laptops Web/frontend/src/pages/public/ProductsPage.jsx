import { useState } from 'react';
import BrandFilter from '../../components/BrandFilter';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';

export default function ProductsPage() {
  const [brand, setBrand] = useState('');
  const { products, loading } = useProducts(brand);

  // Separate featured and regular products
  const featuredProducts = products.filter(p => p.is_featured);
  const regularProducts = products.filter(p => !p.is_featured);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl">Laptop Collection</h1>
          <p className="mt-1 text-sand/70">Find the right Dell or HP machine for your workflow.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-sand/80">
            <span className="rounded-full border border-white/20 px-3 py-1">Premium Stock</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Official Warranty</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Fast Delivery</span>
          </div>
        </div>
        <BrandFilter activeBrand={brand} onChange={setBrand} />
      </div>

      {loading ? (
        <p className="mt-10 text-sand/70">Loading products...</p>
      ) : (
        <>
          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-heading text-2xl">⭐ Featured Products</h2>
                <span className="rounded-full bg-coral/20 px-3 py-1 text-xs font-semibold text-coral">
                  {featuredProducts.length} items
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* All Products Section */}
          {regularProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 font-heading text-2xl">All Products</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {regularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no products */}
          {products.length === 0 && (
            <p className="mt-10 text-sand/70">No products found.</p>
          )}
        </>
      )}
    </div>
  );
}
