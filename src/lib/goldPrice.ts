// Altın fiyatını çekmek için servis
export interface GoldPriceResponse {
  success: boolean;
  data: {
    base: string;
    currency: string;
    rates: {
      [key: string]: number;
    };
  };
}

export async function getGoldPrice(): Promise<number> {
  // Vercel deployment için sabit altın fiyatı kullan
  // Gerçek uygulamada bu değer API'den çekilebilir
  const currentGoldPricePerGram = 65; // USD/gram
  
  console.log('Altın fiyatı kullanılıyor:', currentGoldPricePerGram, 'USD/gram');
  return currentGoldPricePerGram;
}

// Cache için basit bir in-memory cache
let cachedGoldPrice: number | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export async function getCachedGoldPrice(): Promise<number> {
  const now = Date.now();
  
  // Cache hala geçerli mi kontrol et
  if (cachedGoldPrice && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedGoldPrice;
  }
  
  // Yeni fiyat çek ve cache'le
  cachedGoldPrice = await getGoldPrice();
  cacheTimestamp = now;
  
  return cachedGoldPrice;
}
