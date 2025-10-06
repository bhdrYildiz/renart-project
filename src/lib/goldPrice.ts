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
    
    const pricePerOunce = data.price || data.rates?.USD || 2000;
    const pricePerGram = pricePerOunce / 31.1035;
    
    console.log('Altın fiyatı başarıyla çekildi:', pricePerGram, 'USD/gram');
    return pricePerGram;
  } catch (error) {
    console.error('Altın fiyatı çekilirken hata:', error);
    
    console.log('API başarısız, sabit değer kullanılıyor: 65 USD/gram');
    return 65;
  }
}

let cachedGoldPrice: number | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getCachedGoldPrice(): Promise<number> {
  const now = Date.now();
  
  if (cachedGoldPrice && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedGoldPrice;
  }
  
  cachedGoldPrice = await getGoldPrice();
  cacheTimestamp = now;
  
  return cachedGoldPrice;
}
