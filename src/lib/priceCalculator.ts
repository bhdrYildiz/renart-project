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

// Fiyat hesaplama formülü: Price = (popularityScore + 1) * weight * goldPrice
export function calculatePrice(popularityScore: number, weight: number, goldPrice: number): number {
  return (popularityScore + 1) * weight * goldPrice;
}

// Tüm ürünler için fiyat hesapla
export async function calculateProductPrices(products: Product[]): Promise<ProductWithPrice[]> {
  const goldPrice = await getCachedGoldPrice();
  
  return products.map(product => ({
    ...product,
    price: calculatePrice(product.popularityScore, product.weight, goldPrice),
    goldPrice: goldPrice
  }));
}

// Fiyatı USD formatında göster
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}
