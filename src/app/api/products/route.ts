import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { calculateProductPrices, Product } from '@/lib/priceCalculator';

interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  minPopularity?: number;
  maxPopularity?: number;
}

export async function GET(request: NextRequest) {
  try {
    // URL'den filtre parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters: FilterParams = {};
    
    if (searchParams.get('minPrice')) {
      filters.minPrice = parseFloat(searchParams.get('minPrice')!);
    }
    if (searchParams.get('maxPrice')) {
      filters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
    }
    if (searchParams.get('minPopularity')) {
      filters.minPopularity = parseFloat(searchParams.get('minPopularity')!);
    }
    if (searchParams.get('maxPopularity')) {
      filters.maxPopularity = parseFloat(searchParams.get('maxPopularity')!);
    }

    // JSON dosyasından ürünleri al
    const products = productsData as Product[];
    
    // Fiyatları hesapla
    const productsWithPrices = await calculateProductPrices(products);
    
    // Filtreleri uygula
    let filteredProducts = productsWithPrices;

    // Fiyat aralığı filtresi
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice!);
    }

    // Popülerlik puanı filtresi (5 üzerinden - frontend'ten gelen değerleri 0-1'e çevir)
    if (filters.minPopularity !== undefined) {
      const minScore = filters.minPopularity / 5; // 5 üzerinden gelen değeri 0-1'e çevir
      filteredProducts = filteredProducts.filter(product => product.popularityScore >= minScore);
    }
    if (filters.maxPopularity !== undefined) {
      const maxScore = filters.maxPopularity / 5; // 5 üzerinden gelen değeri 0-1'e çevir
      filteredProducts = filteredProducts.filter(product => product.popularityScore <= maxScore);
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
      totalCount: productsWithPrices.length,
      filters: filters
    });
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Ürünler yüklenirken bir hata oluştu',
        data: []
      },
      { status: 500 }
    );
  }
}
