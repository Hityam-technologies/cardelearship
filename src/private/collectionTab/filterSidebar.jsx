import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ isOpen, onClose, activeFilters, setActiveFilters, cars, isMobile }) => {
    // Extract unique values for dynamic filters from cars data
    const availableBrands = useMemo(() => [...new Set(cars.map(c => c.brand))].sort(), [cars]);
    const availableFuelTypes = useMemo(() => [...new Set(cars.map(c => c.fuelType))].filter(Boolean).sort(), [cars]);
    const availableColors = useMemo(() => [...new Set(cars.map(c => c.color))].filter(Boolean).sort(), [cars]);
    const availableTransmissions = ['Automatic', 'Manual']; // Assuming standard values, can be derived if in data
    const availableSeats = useMemo(() => [...new Set(cars.map(c => c.seats))].filter(Boolean).sort(), [cars]);



    const handleReset = () => {
        const defaultFilters = {
            search: '',
            brands: [],
            bodyTypes: [],
            fuelTypes: [],
            transmissions: [],
            colors: [],
            seats: [],
            maxPrice: 50000000,
            sort: 'relevance'
        };
        setActiveFilters(defaultFilters);
    };

    const toggleArrayFilter = (key, value) => {
        setActiveFilters(prev => {
            const currentArray = prev[key] || [];
            if (currentArray.includes(value)) {
                return { ...prev, [key]: currentArray.filter(item => item !== value) };
            } else {
                return { ...prev, [key]: [...currentArray, value] };
            }
        });
    };

    // Helper to format price for slider
    const formatPrice = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(0)} Lakh`;
        return `₹${value.toLocaleString()}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
                        />
                    )}
                    <motion.div
                        initial={isMobile ? { y: '100%' } : { width: 0, opacity: 0 }}
                        animate={isMobile ? { y: 0 } : { width: 380, opacity: 1 }}
                        exit={isMobile ? { y: '100%' } : { width: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`${isMobile ? 'fixed bottom-0 left-0 right-0 h-[70vh] rounded-t-[32px] z-[100]' : 'relative z-10 shrink-0 h-full border-l origin-right'} bg-[#1a1a1a] border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden`}
                    >
                        {isMobile && (
                            <div className="w-full flex justify-center pt-4 pb-2 shrink-0">
                                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                            </div>
                        )}
                        <div className="w-full h-full flex flex-col">
                            {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                            <h2 className="text-white text-xl font-michroma font-bold">Filters</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleReset}
                                    className="text-[#da2525] text-sm font-medium hover:text-[#ff3b3b] transition-colors"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Filter Content */}
                        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-16 space-y-8 custom-scrollbar">



                            {/* Sort */}
                            <div className="space-y-3">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Sort By</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'relevance', label: 'Relevance' },
                                        { value: 'price_asc', label: 'Price: Low to High' },
                                        { value: 'price_desc', label: 'Price: High to Low' },
                                        { value: 'power_desc', label: 'Highest Power' },
                                    ].map(sortOption => (
                                        <button
                                            key={sortOption.value}
                                            onClick={() => setActiveFilters({ ...activeFilters, sort: sortOption.value })}
                                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 border ${activeFilters.sort === sortOption.value
                                                    ? 'bg-[#da2525] text-white border-[#da2525]'
                                                    : 'bg-[#2a2a2a] text-white/70 border-[#3a3a3a] hover:border-[#555] hover:bg-[#333]'
                                                }`}
                                        >
                                            {sortOption.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brand */}
                            {availableBrands.length > 0 && (
                                <div className="space-y-3">
                                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Brand</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableBrands.map(brand => (
                                            <button
                                                key={brand}
                                                onClick={() => toggleArrayFilter('brands', brand)}
                                                className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 border ${(activeFilters.brands || []).includes(brand)
                                                        ? 'bg-white text-black border-white'
                                                        : 'bg-transparent text-white/70 border-[#3a3a3a] hover:border-[#666] hover:text-white'
                                                    }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}



                            {/* Max Price */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Max Price</label>
                                    <span className="text-white font-bold">{formatPrice(activeFilters.maxPrice)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500000"
                                    max="50000000"
                                    step="500000"
                                    value={activeFilters.maxPrice || 50000000}
                                    onChange={(e) => setActiveFilters({ ...activeFilters, maxPrice: Number(e.target.value) })}
                                    className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#da2525]"
                                />
                                <div className="flex justify-between text-xs text-white/40">
                                    <span>₹5L</span>
                                    <span>₹5Cr</span>
                                </div>
                            </div>

                            {/* Fuel Type */}
                            {availableFuelTypes.length > 0 && (
                                <div className="space-y-3">
                                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Fuel Type</label>
                                    <div className="flex flex-wrap gap-3">
                                        {availableFuelTypes.map(fuel => (
                                            <button
                                                key={fuel}
                                                onClick={() => toggleArrayFilter('fuelTypes', fuel)}
                                                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${(activeFilters.fuelTypes || []).includes(fuel)
                                                        ? 'bg-[#da2525]/10 text-[#da2525] border-[#da2525]'
                                                        : 'bg-transparent text-white/70 border-[#3a3a3a] hover:border-[#666] hover:text-white'
                                                    }`}
                                            >
                                                {fuel}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Transmission & Seats */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Transmission</label>
                                    <div className="flex flex-col gap-2">
                                        {availableTransmissions.map(trans => (
                                            <label key={trans} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${(activeFilters.transmissions || []).includes(trans)
                                                        ? 'bg-[#da2525] border-[#da2525]'
                                                        : 'border-[#3a3a3a] group-hover:border-[#666] bg-[#2a2a2a]'
                                                    }`}>
                                                    {(activeFilters.transmissions || []).includes(trans) && (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{trans}</span>
                                                {/* Hidden input to make it accessible if needed, but div toggle is fine here */}
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={(activeFilters.transmissions || []).includes(trans)}
                                                    onChange={() => toggleArrayFilter('transmissions', trans)}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {availableSeats.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Seats</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSeats.map(seat => (
                                                <button
                                                    key={seat}
                                                    onClick={() => toggleArrayFilter('seats', seat)}
                                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 border flex items-center justify-center ${(activeFilters.seats || []).includes(seat)
                                                            ? 'bg-white text-black border-white'
                                                            : 'bg-transparent text-white/70 border-[#3a3a3a] hover:border-[#666] hover:text-white'
                                                        }`}
                                                >
                                                    {seat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterSidebar;
