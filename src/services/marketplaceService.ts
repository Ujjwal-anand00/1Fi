import { marketplaceProducts } from '../data/marketplaceData';
import type { Product } from '../types/marketplace';

type RequestOptions = {
  delayMs?: number;
  shouldFail?: boolean;
};

const DEFAULT_DELAY_MS = 400;

// Mock a short network delay
function delay(ms = DEFAULT_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(data: T, options: RequestOptions = {}) {
  await delay(options.delayMs);

  if (options.shouldFail) {
    throw new Error('Marketplace service unavailable');
  }

  return data;
}

export async function getProducts(options?: RequestOptions): Promise<Product[]> {
  return request([...marketplaceProducts], options);
}

export async function getProductById(id: string, options?: RequestOptions): Promise<Product | null> {
  const product = marketplaceProducts.find((item) => item.id === id) ?? null;
  return request(product, options);
}

export async function getProductsByCategory(category: string, options?: RequestOptions): Promise<Product[]> {
  const normalizedCategory = category.trim().toLowerCase();
  const products = marketplaceProducts.filter((product) => product.category.toLowerCase() === normalizedCategory);

  return request(products, options);
}
