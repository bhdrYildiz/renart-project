'use client';

import { useState, useEffect } from 'react';

interface FilterState {
    minPrice: string;
    maxPrice: string;
    minPopularity: string;
    maxPopularity: string;
}

interface ProductFiltersProps {
    onFiltersChange: (filters: FilterState) => void;
    isLoading: boolean;
    currentFilters: FilterState;
}

export default function ProductFilters({ onFiltersChange, isLoading, currentFilters }: ProductFiltersProps) {
    const [filters, setFilters] = useState<FilterState>(currentFilters);

    useEffect(() => {
        setFilters(currentFilters);
    }, [currentFilters]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };
    const handleQuickFilter = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            minPrice: '',
            maxPrice: '',
            minPopularity: '',
            maxPopularity: ''
        };
        setFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-['Avenir'] font-medium text-black">
                    Filtreler
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-black underline"
                        disabled={isLoading}
                    >
                        Filtreleri Temizle
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fiyat Aralığı */}
                <div className="space-y-3">
                    <label className="block text-sm font-['Avenir'] font-medium text-black">
                        Fiyat Aralığı (USD)
                    </label>
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Min. Fiyat"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Avenir'] text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black-400 focus:border-black-400"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Max. Fiyat"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Avenir'] text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black-400 focus:border-black-400"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Popülerlik Puanı */}
                <div className="space-y-3">
                    <label className="block text-sm font-['Avenir'] font-medium text-black">
                        Popülerlik Puanı (5 üzerinden)
                    </label>
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                placeholder="Min. Puan (0-5)"
                                value={filters.minPopularity}
                                onChange={(e) => handleFilterChange('minPopularity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Avenir'] text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black-400 focus:border-black-400"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                placeholder="Max. Puan (0-5)"
                                value={filters.maxPopularity}
                                onChange={(e) => handleFilterChange('maxPopularity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Avenir'] text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black-400 focus:border-black-400"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtreleme Butonları */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                    <button
                        onClick={() => onFiltersChange(filters)}
                        disabled={isLoading}
                        className="px-6 py-2 bg-black text-white cursor-pointer rounded-md font-['Avenir'] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Filtreleniyor...' : 'Filtrele'}
                    </button>
                    <button
                        onClick={clearFilters}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gray-200 text-black cursor-pointer rounded-md font-['Avenir'] font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Filtreleri Temizle
                    </button>
                </div>
            </div>

            {/* Hızlı Filtre Butonları */}
            <div className="mt-4">
                <h4 className="text-sm font-['Avenir'] font-medium text-black mb-3">
                    Hızlı Filtreler
                </h4>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleQuickFilter('minPrice', '500')}
                        className="px-3 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100 font-['Avenir']"
                        disabled={isLoading}
                    >
                        $500+
                    </button>
                    <button
                        onClick={() => handleQuickFilter('maxPrice', '400')}
                        className="px-3 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100 font-['Avenir']"
                        disabled={isLoading}
                    >
                        $400 Altı
                    </button>
                    <button
                        onClick={() => handleQuickFilter('minPopularity', '4')}
                        className="px-3 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100 font-['Avenir']"
                        disabled={isLoading}
                    >
                        Popüler (4+ ⭐)
                    </button>
                    <button
                        onClick={() => handleQuickFilter('minPopularity', '4.5')}
                        className="px-3 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100 font-['Avenir']"
                        disabled={isLoading}
                    >
                        En Popüler (4.5+ ⭐)
                    </button>
                </div>
            </div>
        </div>
    );
}
