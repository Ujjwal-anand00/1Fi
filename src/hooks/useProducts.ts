import { useCallback, useEffect, useState } from 'react';

import { getProducts } from '../services/marketplaceService';
import type { Product } from '../types/marketplace';

type UseProductsResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      setProducts(response);
    } catch {
      setProducts([]);
      setError('Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refetch: loadProducts,
  };
}
