import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getInventoryPreview, getCarDescription, getDealershipStats } from '../data/cars';
import { navigateToCollection, ROUTES } from '../utils/navigation';

const ChevronDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const QualityAssuredCard = ({ className = "" }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[24px] w-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${className}`}>
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/30">
                    <svg className="w-[18px] h-[18px] text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                    </svg>
                </div>
                <p className="font-michroma text-[12px] sm:text-[14px] text-white/80 tracking-[2px] uppercase m-0 font-medium">QUALITY ASSURED</p>
            </div>
            <div className="flex flex-col sm:ml-[48px]">
                <span className="text-[11px] sm:text-[12px] font-bold text-white tracking-[1.5px] uppercase m-0 leading-relaxed">RIGOROUS</span>
                <span className="text-[11px] sm:text-[12px] font-bold text-white/60 tracking-[1.5px] uppercase m-0 leading-relaxed">INSPECTION</span>
            </div>
        </div>
        
        <div className="flex items-center self-start sm:self-auto border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0 sm:border-l sm:pl-8 w-full sm:w-auto">
            <h3 className="font-michroma text-[42px] sm:text-[52px] text-white m-0 font-bold tracking-tight">150<span className="text-[20px] sm:text-[24px] text-red-500 ml-1">PT</span></h3>
        </div>
    </div>
);

const InventorySection = () => {
    const navigate = useNavigate();
    const inventoryCars = getInventoryPreview();
    const stats = getDealershipStats();
    const [expandedId, setExpandedId] = useState(inventoryCars[0]?.id ?? null);

    const toggleItem = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const handleViewCar = (carId) => {
        navigateToCollection(navigate, { carId, showDetails: true });
    };

    const handleBrowseMore = () => {
        navigate(ROUTES.COLLECTION);
    };

    return (
        <div
            className="w-full max-w-full rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] relative overflow-hidden shrink-0 bg-cover bg-center min-h-0 xl:min-h-[720px]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1526655805340-274e69922288?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}
        >
            <div
                className="absolute inset-0 opacity-[0.25] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.5'%3E%3Cpath d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/%3E%3Cpath d='M28 36 L56 52 L56 84 L28 100 L0 84 L0 52 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '56px 100px',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/95 pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-stretch px-4 sm:px-8 md:px-12 xl:px-16 py-8 sm:py-12 xl:py-16 gap-12 sm:gap-16 xl:gap-20 min-w-0">
                <div className="flex flex-col justify-between xl:w-[40%] xl:max-w-[460px] gap-12 xl:gap-0 shrink-0 min-w-0 relative">
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                    
                    <div className="flex flex-col gap-5 sm:gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-white/70 font-michroma text-[11px] font-bold tracking-[3px]">INVENTORY</span>
                        </div>
                        <h2 className="font-michroma text-[36px] sm:text-[44px] md:text-[52px] leading-[1.1] font-bold uppercase text-white m-0 tracking-tight">
                            Browse what<br />
                            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">just landed</span>
                        </h2>
                        <p className="text-[#999] text-[13px] sm:text-[14px] leading-[1.8] tracking-[1px] uppercase m-0 max-w-[380px] border-l-2 border-red-600/50 pl-4 font-medium">
                            {stats.modelCount} MODELS IN STOCK · UPDATED DAILY WITH PREMIUM VEHICLES
                        </p>
                        
                        <div className="flex mt-6 sm:mt-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] w-fit max-w-full group">
                            <button
                                type="button"
                                onClick={handleBrowseMore}
                                className="font-michroma flex items-center bg-white/95 backdrop-blur-md text-black border-none h-[50px] sm:h-[56px] pr-6 sm:pr-10 pl-5 sm:pl-8 text-[13px] sm:text-[14px] font-bold tracking-[1px] cursor-pointer rounded-l hover:bg-white [clip-path:polygon(0_0,100%_0,calc(100%-15px)_100%,0_100%)] transition-colors"
                            >
                                EXPLORE ALL
                            </button>
                            <button
                                type="button"
                                onClick={handleBrowseMore}
                                aria-label="Browse collection"
                                className="bg-[#cc0000] text-white border-none w-[54px] sm:w-[60px] h-[50px] sm:h-[56px] flex items-center justify-center cursor-pointer rounded-r hover:bg-[#b30000] [clip-path:polygon(15px_0,100%_0,100%_100%,0_100%)] -ml-[10px] transition-colors duration-300 shrink-0"
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-arrow-slide">
                                    <polyline points="13 17 18 12 13 7" />
                                    <polyline points="6 17 11 12 6 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <QualityAssuredCard className="hidden xl:flex" />
                </div>
                
                <div className="flex-1 flex flex-col border-t border-[#222] xl:border-t-0 min-w-0 pr-2">
                    {inventoryCars.map((car, index) => {
                        const isExpanded = expandedId === car.id;
                        const isLast = index === inventoryCars.length - 1;
                        const displayId = String(index + 1).padStart(2, '0');
                        const carName = `${car.brand} ${car.model}`;

                        return (
                            <div key={car.id} className={`border-b border-[#222] ${isLast ? 'border-b-0' : ''}`}>
                                {isExpanded ? (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="py-4 xl:py-6 overflow-hidden relative"
                                    >
                                        <div className="relative w-full mb-5 group cursor-pointer" onClick={() => handleViewCar(car.id)}>
                                            <div className="w-full rounded-[24px] overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/5 shadow-2xl relative">
                                                {/* Background Glow */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-red-900/20 blur-[80px] rounded-full pointer-events-none"></div>
                                                
                                                <img
                                                    src={car.image}
                                                    alt={carName}
                                                    loading="lazy"
                                                    className="w-full h-[220px] sm:h-[260px] md:h-[320px] xl:h-[30vh] xl:max-h-[320px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700 ease-out z-10 relative"
                                                />
                                                
                                                {/* Overlay Gradient for Text */}
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
                                                
                                                {/* Text Info Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold tracking-[1px] uppercase rounded-[4px]">{car.type}</span>
                                                            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white/80 text-[9px] font-bold tracking-[1px] uppercase rounded-[4px] border border-white/10">In Stock</span>
                                                        </div>
                                                        <h3 className="font-michroma text-[20px] sm:text-[24px] text-white font-normal m-0 leading-tight uppercase tracking-wide">
                                                            {carName}
                                                        </h3>
                                                        <p className="text-white/60 text-[11px] sm:text-[12px] leading-relaxed tracking-[0.5px] uppercase m-0 mt-2 max-w-[400px] hidden sm:block">
                                                            {getCarDescription(car)}
                                                        </p>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-[#888] text-[10px] font-bold tracking-[2px] uppercase mb-1 m-0">Starting from</p>
                                                        <p className="text-[#da2525] font-michroma text-[20px] sm:text-[22px] m-0">{car.price}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="absolute top-4 right-4 z-30 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleViewCar(car.id); }}
                                                    className="w-[40px] h-[40px] bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-black rounded-full flex items-center justify-center cursor-pointer border border-white/20 transition-all duration-300 shadow-lg"
                                                    aria-label={`View ${carName}`}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="13 17 18 12 13 7" />
                                                        <polyline points="6 17 11 12 6 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); toggleItem(car.id); }}
                                                    className="w-[40px] h-[40px] bg-black/40 hover:bg-black/60 backdrop-blur-md text-[#aaa] hover:text-white rounded-full flex items-center justify-center cursor-pointer border border-white/10 transition-colors"
                                                    aria-label={`Collapse ${carName}`}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="18 15 12 9 6 15" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => toggleItem(car.id)}
                                        className="w-full flex items-center gap-4 sm:gap-5 py-4 xl:py-4 bg-transparent border-none cursor-pointer text-left group min-w-0 transition-all duration-300 hover:bg-white/[0.02] px-2 rounded-xl"
                                    >
                                        <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] xl:w-[64px] xl:h-[64px] rounded-[12px] overflow-hidden shrink-0 bg-gradient-to-br from-[#1a1a1a] to-[#111] p-1 border border-white/5 group-hover:border-white/20 transition-colors shadow-inner">
                                            <img src={car.image} alt={carName} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1 min-w-0">
                                            <span className="text-[9px] text-[#555] font-bold tracking-[2px] uppercase mb-1 group-hover:text-red-500 transition-colors">#{displayId}</span>
                                            <span className="font-michroma text-[14px] sm:text-[16px] md:text-[18px] text-[#999] group-hover:text-white transition-colors duration-300 font-normal uppercase truncate">
                                                {carName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 pr-2">
                                            <span className="text-[#da2525] font-michroma text-[12px] sm:text-[14px] hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">{car.price}</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <span className="text-[#666] group-hover:text-white transition-colors">
                                                    <ChevronDown />
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Mobile Only: Render the Quality Assured card below the inventory list */}
                    <QualityAssuredCard className="xl:hidden mt-6 sm:mt-8" />
                </div>
            </div>
        </div>
    );
};

export default InventorySection;
