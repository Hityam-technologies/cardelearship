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

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-stretch px-4 sm:px-8 md:px-12 xl:px-16 py-8 sm:py-10 xl:py-12 gap-10 sm:gap-12 xl:gap-16 min-w-0">
                <div className="flex flex-col justify-between xl:w-[38%] xl:max-w-[420px] gap-12 xl:gap-0 shrink-0 min-w-0">
                    <div className="flex flex-col gap-4">
                        <span className="text-white font-michroma text-[12px] font-bold tracking-[2px]">[ INVENTORY_ ]</span>
                        <h2 className="font-michroma text-[32px] md:text-[40px] leading-[1.15] font-normal uppercase text-white m-0">
                            Browse what<br />just landed
                        </h2>
                        <p className="text-[#888] text-[12px] leading-[1.7] tracking-[0.5px] uppercase m-0 max-w-[340px]">
                            {stats.modelCount} MODELS IN STOCK · UPDATED DAILY
                        </p>
                        <div className="flex mt-4 w-fit origin-left transition-transform duration-200 hover:scale-105 active:scale-95">
                            <button
                                type="button"
                                onClick={handleBrowseMore}
                                className="font-michroma bg-white text-black border-none py-3.5 pr-9 pl-7 text-[12px] font-normal cursor-pointer rounded-l hover:bg-[#f0f0f0] [clip-path:polygon(0_0,100%_0,calc(100%-12px)_100%,0_100%)]"
                            >
                                BROWSE MORE
                            </button>
                            <button
                                type="button"
                                onClick={handleBrowseMore}
                                aria-label="Browse collection"
                                className="bg-[#d32f2f] text-white border-none w-[52px] flex items-center justify-center cursor-pointer rounded-r hover:bg-[#b71c1c] [clip-path:polygon(12px_0,100%_0,100%_100%,0_100%)] -ml-[8px] transition-colors duration-300"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="13 17 18 12 13 7" />
                                    <polyline points="6 17 11 12 6 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <svg className="w-[26px] h-[26px] text-[#d32f2f] mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <p className="font-michroma text-[10px] text-[#666] tracking-[1px] uppercase m-0">HAPPY CUSTOMER</p>
                        <div className="flex items-center gap-4">
                            <h3 className="font-michroma text-[28px] text-white m-0 font-normal">{stats.happyCustomers}</h3>
                            <div className="flex">
                                <img className="w-[30px] h-[30px] rounded-full border-2 border-[#0c0c0c] -ml-[10px] first:ml-0" src="https://i.pravatar.cc/100?img=33" alt="Customer 1" />
                                <img className="w-[30px] h-[30px] rounded-full border-2 border-[#0c0c0c] -ml-[10px] first:ml-0" src="https://i.pravatar.cc/100?img=47" alt="Customer 2" />
                                <img className="w-[30px] h-[30px] rounded-full border-2 border-[#0c0c0c] -ml-[10px] first:ml-0" src="https://i.pravatar.cc/100?img=12" alt="Customer 3" />
                            </div>
                        </div>
                    </div>
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
                                        className="py-5 xl:py-6 overflow-hidden relative"
                                    >
                                        <div className="relative w-full mb-4 xl:mb-5">
                                            <div
                                                className="w-full rounded-[24px] overflow-hidden bg-[#1a1a1a]"
                                                style={{
                                                    WebkitMaskImage: 'radial-gradient(circle at 28px 28px, transparent 38px, black 39px)',
                                                    maskImage: 'radial-gradient(circle at 28px 28px, transparent 38px, black 39px)',
                                                }}
                                            >
                                                <img
                                                    src={car.image}
                                                    alt={carName}
                                                    loading="lazy"
                                                    className="w-full h-[200px] sm:h-[240px] md:h-[300px] xl:h-[28vh] xl:max-h-[300px] object-contain"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleViewCar(car.id)}
                                                className="absolute top-0 left-0 w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center cursor-pointer border-none shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-[#f5f5f5] transition-all hover:scale-105 active:scale-95 z-20"
                                                aria-label={`View ${carName}`}
                                            >
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="13 17 18 12 13 7" />
                                                    <polyline points="6 17 11 12 6 7" />
                                                </svg>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => toggleItem(car.id)}
                                                className="absolute top-4 right-4 z-20 text-[#aaa] hover:text-white transition-colors cursor-pointer bg-transparent border-none p-2"
                                                aria-label={`Collapse ${carName}`}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="18 15 12 9 6 15" />
                                                </svg>
                                            </button>
                                        </div>

                                        <h3 className="font-michroma text-[18px] md:text-[20px] xl:text-[22px] text-white font-normal m-0 mb-1.5 xl:mb-2 uppercase tracking-wide">
                                            {displayId} — {carName}
                                        </h3>
                                        <p className="text-[#888] text-[11px] md:text-[12px] leading-[1.6] tracking-[0.5px] uppercase m-0 max-w-[600px]">
                                            {getCarDescription(car)}
                                        </p>
                                        <p className="text-[#da2525] font-michroma text-[13px] mt-2 m-0">{car.price}</p>
                                    </motion.div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => toggleItem(car.id)}
                                        className="w-full flex items-center gap-4 sm:gap-5 py-4 xl:py-3.5 bg-transparent border-none cursor-pointer text-left group min-w-0 hover:translate-x-2 transition-transform duration-200"
                                    >
                                        <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] xl:w-[64px] xl:h-[64px] rounded-[12px] overflow-hidden shrink-0 bg-[#1a1a1a] p-1">
                                            <img src={car.image} alt={carName} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <span className="font-michroma text-[13px] sm:text-[15px] md:text-[17px] text-[#aaa] group-hover:text-white transition-colors duration-300 font-normal uppercase flex-1 min-w-0 truncate">
                                            {displayId} — {carName}
                                        </span>
                                        <span className="text-[#555] group-hover:text-white transition-colors shrink-0 pr-1">
                                            <ChevronDown />
                                        </span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InventorySection;
