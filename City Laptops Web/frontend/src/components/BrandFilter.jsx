const brands = ['All', 'Dell', 'HP'];

export default function BrandFilter({ activeBrand, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1">
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onChange(brand === 'All' ? '' : brand)}
          className={`rounded-full px-4 py-2 text-sm transition ${
            (activeBrand || 'All') === brand
              ? 'bg-mint text-ink'
              : 'text-sand/80 hover:text-sand'
          }`}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}
