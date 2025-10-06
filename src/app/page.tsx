'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { ProductWithPrice } from '@/lib/priceCalculator';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  minPopularity: string;
  maxPopularity: string;
}

export default function Home() {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    minPopularity: '',
    maxPopularity: ''
  });
  const [totalCount, setTotalCount] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (filterParams: FilterState) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filterParams.minPrice) params.append('minPrice', filterParams.minPrice);
      if (filterParams.maxPrice) params.append('maxPrice', filterParams.maxPrice);
      if (filterParams.minPopularity) params.append('minPopularity', filterParams.minPopularity);
      if (filterParams.maxPopularity) params.append('maxPopularity', filterParams.maxPopularity);

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalCount(data.totalCount || data.count);
        setError(null);
      } else {
        setError(data.error || 'Ürünler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts({
      minPrice: '',
      maxPrice: '',
      minPopularity: '',
      maxPopularity: ''
    });
  }, [fetchProducts]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setCurrentIndex(0);
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [fetchProducts]);

  const handleScrollBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const maxIndex = Math.max(0, products.length - 4);
    const newIndex = Math.round(percentage * maxIndex);
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, products.length - 4);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Avenir']">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-black mb-2">Hata</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="relative flex items-center justify-center mb-8">
          <h1 className="text-5xl font-['Avenir'] font-normal text-black">
            Product List
          </h1>
          <div className="absolute right-48 flex items-center">
            <div className="w-40 h-px bg-black/30"></div>
            <span className="ml-4 text-xs font-['Avenir'] font-normal text-gray-500">
              Avenir - Book - 45
            </span>
          </div>
        </div>

        {/* Ürün Sayısı */}
        <div className="text-center mb-6">
          <p className="text-lg font-['Avenir'] text-gray-600">
            {loading ? 'Yükleniyor...' : `${products.length} ürün gösteriliyor${totalCount > products.length ? ` (${totalCount} toplam)` : ''}`}
          </p>
        </div>

        {/* Filtreler */}
        <ProductFilters
          onFiltersChange={handleFiltersChange}
          isLoading={loading}
          currentFilters={filters}
        />

        {/* Product Carousel */}
        <div className="relative">
          {/* Navigation Arrows - Basit siyah oklar */}
          {/* Sol ok */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute -left-16 top-1/2 transform cursor-pointer -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Sağ ok */}
          <button
            onClick={nextSlide}
            disabled={currentIndex >= products.length - 4}
            className={`absolute -right-16 top-1/2 transform cursor-pointer -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border ${currentIndex >= products.length - 4 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Products Container - Tam genişlik */}
          <div
            ref={carouselRef}
            className="flex gap-28 p-2 justify-start overflow-hidden"
            onTouchStart={handleTouchStart}
          >
            {visibleProducts.map((product, index) => (
              <div key={index} className="flex space-x-4 gap-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        {/* Scroll Bar */}
        <div
          className="relative mt-6 h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleScrollBarClick}
        >
          <div
            className="absolute top-0 left-0 h-2 bg-gray-400 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex) / Math.max(1, products.length - 4)) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}