import { getCachedGoldPrice } from './goldPrice';

export interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
}

export interface ProductWithPrice extends Product {
  price: number;
  goldPrice: number;
}

export function calculatePrice(popularityScore: number, weight: number, goldPrice: number): number {
  return (popularityScore + 1) * weight * goldPrice;
}

export async function calculateProductPrices(products: Product[]): Promise<ProductWithPrice[]> {
  const goldPrice = await getCachedGoldPrice();
  
  return products.map(product => ({
    ...product,
    price: calculatePrice(product.popularityScore, product.weight, goldPrice),
    goldPrice: goldPrice
  }));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}
