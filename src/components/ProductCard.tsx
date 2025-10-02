'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProductWithPrice, formatPrice } from '@/lib/priceCalculator';

interface ProductCardProps {
    product: ProductWithPrice;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [selectedColor, setSelectedColor] = useState<'yellow' | 'rose' | 'white'>('yellow');

    const getColorName = (color: string) => {
        switch (color) {
            case 'yellow': return 'Yellow Gold';
            case 'white': return 'White Gold';
            case 'rose': return 'Rose Gold';
            default: return 'Yellow Gold';
        }
    };

    const getColorCode = (color: string) => {
        switch (color) {
            case 'yellow': return '#E6CA97';
            case 'white': return '#D9D9D9';
            case 'rose': return '#E1A4A9';
            default: return '#E6CA97';
        }
    };

    const renderStars = (score: number) => {
        // Score'u 5 üzerinden hesapla
        const starScore = score * 5;
        const fullStars = Math.floor(starScore);
        const hasHalfStar = starScore % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center ">
                {[...Array(fullStars)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#E6CA97] fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                {hasHalfStar && (
                    <div className="relative w-4 h-4">
                        <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <svg className="w-4 h-4 text-[#E6CA97] fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm font-['Avenir'] text-black">
                    {starScore.toFixed(1)}/5
                </span>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Ürün Resmi */}
            <div className="relative h-54 w-54 mb-4 bg-white rounded-2xl overflow-hidden">
                <Image
                    src={product.images[selectedColor]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
            </div>

            {/* Ürün Bilgileri */}
            <div className="space-y-2">
                <h3 className="text-lg font-['Avenir'] font-normal text-black">
                    {product.name}
                </h3>

                {/* Fiyat */}
                <div className="text-lg font-['Avenir'] font-normal text-black/80">
                    {formatPrice(product.price)} USD
                </div>

                {/* Renk Seçenekleri */}
                <div className="space-y-2">
                    <div className="flex space-x-2">
                        {Object.entries(product.images).map(([color, imageUrl]) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color as 'yellow' | 'rose' | 'white')}
                                className={`w-6 h-6 rounded-full border-2 ${selectedColor === color
                                    ? 'border-black ring-2 ring-gray-300'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                style={{
                                    backgroundColor: getColorCode(color)
                                }}
                                title={getColorName(color)}
                            />
                        ))}
                    </div>
                    <p className="text-sm font-['Avenir'] text-black">
                        {getColorName(selectedColor)}
                    </p>
                </div>

                {/* Popülerlik Puanı */}
                <div className="pt-2">
                    {renderStars(product.popularityScore)}
                </div>
            </div>
        </div>
    );
}
