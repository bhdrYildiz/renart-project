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
  try {
    // MetalAPI'den altın fiyatını çek
    const response = await fetch('https://api.metals.live/v1/spot/gold', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // API'den gelen fiyatı USD/gram cinsinden döndür
    // API genellikle USD/ounce cinsinden verir, gram'a çevirmek için 31.1035'e böleriz
    const pricePerOunce = data.price || data.rates?.USD || 2000; // fallback değer
    const pricePerGram = pricePerOunce / 31.1035;
    
    return pricePerGram;
  } catch (error) {
    console.error('Altın fiyatı çekilirken hata:', error);
    // Hata durumunda varsayılan değer döndür (yaklaşık 65 USD/gram)
    return 65;
  }
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
