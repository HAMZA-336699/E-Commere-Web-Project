import { useEffect, useMemo, useState } from 'react';

const defaultForm = {
  name: '',
  brand: 'Dell',
  model: '',
  price: '',
  ram: '',
  ssd: '',
  processor: '',
  display: '',
  description: '',
  is_featured: false,
};

export default function ProductFormModal({ open, initialData, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(defaultForm);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const existingImages = useMemo(() => initialData?.images || [], [initialData]);
  const [keptImageIds, setKeptImageIds] = useState([]);

  useEffect(() => {
    if (!initialData) {
      setForm(defaultForm);
      setKeptImageIds([]);
      return;
    }

    setForm({
      name: initialData.name || '',
      brand: initialData.brand || 'Dell',
      model: initialData.model || '',
      price: initialData.price || '',
      ram: initialData.specs?.ram || '',
      ssd: initialData.specs?.ssd || '',
      processor: initialData.specs?.processor || '',
      display: initialData.specs?.display || '',
      description: initialData.description || '',
      is_featured: initialData.is_featured || false,
    });
    setKeptImageIds((initialData.images || []).map((img) => img.id));
  }, [initialData]);

  if (!open) {
    return null;
  }

  const validate = () => {
    const next = {};
    ['name', 'model', 'price', 'ram', 'ssd', 'processor', 'display'].forEach((key) => {
      if (!form[key]) next[key] = 'Required';
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('brand', form.brand);
    payload.append('model', form.model);
    payload.append('price', form.price);
    payload.append('specs[ram]', form.ram);
    payload.append('specs[ssd]', form.ssd);
    payload.append('specs[processor]', form.processor);
    payload.append('specs[display]', form.display);
    payload.append('description', form.description);
    payload.append('is_featured', form.is_featured ? 1 : 0);
    keptImageIds.forEach((id, idx) => payload.append(`existing_image_ids[${idx}]`, id));
    Array.from(files).forEach((file) => payload.append('images[]', file));

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 text-ink">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-3xl">{initialData ? 'Edit Product' : 'Add Product'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
          <Field label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} error={errors.model} />

          <div>
            <label className="text-sm">Brand</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            >
              <option value="Dell">Dell</option>
              <option value="HP">HP</option>
            </select>
          </div>

          <Field
            label="Price (PKR)"
            type="number"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
            error={errors.price}
          />

          <Field label="RAM" value={form.ram} onChange={(v) => setForm({ ...form, ram: v })} error={errors.ram} />
          <Field label="SSD" value={form.ssd} onChange={(v) => setForm({ ...form, ssd: v })} error={errors.ssd} />
          <Field
            label="Processor"
            value={form.processor}
            onChange={(v) => setForm({ ...form, processor: v })}
            error={errors.processor}
          />
          <Field
            label="Display"
            value={form.display}
            onChange={(v) => setForm({ ...form, display: v })}
            error={errors.display}
          />
        </div>

        <label className="mt-4 block text-sm">Description</label>
        <textarea
          rows={4}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="is_featured"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            className="h-4 w-4 cursor-pointer rounded border-slate-300"
          />
          <label htmlFor="is_featured" className="cursor-pointer text-sm font-medium">
            Add to Featured Products (Show on Homepage)
          </label>
        </div>

        {existingImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm">Existing Images</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((img) => {
                const selected = keptImageIds.includes(img.id);
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() =>
                      setKeptImageIds((prev) =>
                        selected ? prev.filter((id) => id !== img.id) : [...prev, img.id]
                      )
                    }
                    className={`overflow-hidden rounded-xl border-2 ${selected ? 'border-mint' : 'border-slate-300'}`}
                  >
                    <img src={img.url} alt="preview" className="h-20 w-24 object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label className="mt-4 block text-sm">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files || [])}
          className="mt-1 w-full rounded-xl border border-slate-300 p-2"
        />
        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {Array.from(files).map((file) => (
              <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-20 rounded-lg object-cover" />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-xl bg-ink px-6 py-3 font-semibold text-sand disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, error, type = 'text' }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        className={`mt-1 w-full rounded-xl border px-3 py-2 ${error ? 'border-red-400' : 'border-slate-300'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
