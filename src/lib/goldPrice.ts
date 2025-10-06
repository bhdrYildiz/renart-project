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
    // Daha güvenilir bir altın fiyatı API'si kullan
    const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=XAU', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Coinbase API'den gelen fiyatı USD/gram cinsinden döndür
    // API USD/ounce cinsinden verir, gram'a çevirmek için 31.1035'e böleriz
    const pricePerOunce = parseFloat(data.data.rates.USD) || 2000; // fallback değer
    const pricePerGram = pricePerOunce / 31.1035;
    
    console.log('Altın fiyatı başarıyla çekildi:', pricePerGram, 'USD/gram');
    return pricePerGram;
  } catch (error) {
    console.error('Altın fiyatı çekilirken hata:', error);
    
    // Alternatif API dene
    try {
      const response2 = await fetch('https://api.metals.live/v1/spot/gold', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response2.ok) {
        const data2 = await response2.json();
        const pricePerOunce = data2.price || data2.rates?.USD || 2000;
        const pricePerGram = pricePerOunce / 31.1035;
        console.log('Alternatif API ile altın fiyatı çekildi:', pricePerGram, 'USD/gram');
        return pricePerGram;
      }
    } catch (error2) {
      console.error('Alternatif API de başarısız:', error2);
    }
    
    // Her iki API de başarısız olursa varsayılan değer döndür
    console.log('API\'ler başarısız, varsayılan değer kullanılıyor: 65 USD/gram');
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
