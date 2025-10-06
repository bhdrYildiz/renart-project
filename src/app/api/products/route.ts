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

    const products = productsData as Product[];
    
    const productsWithPrices = await calculateProductPrices(products);
    
    let filteredProducts = productsWithPrices;

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.minPopularity !== undefined) {
      const minScore = filters.minPopularity / 5;
      filteredProducts = filteredProducts.filter(product => product.popularityScore >= minScore);
    }
    if (filters.maxPopularity !== undefined) {
      const maxScore = filters.maxPopularity / 5;
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
