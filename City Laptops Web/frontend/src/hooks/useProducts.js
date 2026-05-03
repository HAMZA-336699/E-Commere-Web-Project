import { useEffect, useState } from 'react';
import api from '../api/axios';

export function useProducts(brand) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const query = brand ? `?brand=${brand}` : '';
        const { data } = await api.get(`/products${query}`);
        setProducts(data.data || []);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [brand]);

  return { products, loading, setProducts };
}
