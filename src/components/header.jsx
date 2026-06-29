import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryDetails } from '../data/cars';
import { NAV_TABS, ROUTES } from '../utils/navigation';

const CATEGORY_DETAILS = getCategoryDetails();

const Header = ({ viewMode, setViewMode, categories, activeCategory, setActiveCategory, cars, onSelectCar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            {/* Top Nav Bar */}
            <div className="absolute top-0 left-0 right-0 lg:right-auto lg:w-auto h-[64px] sm:h-[72px] lg:h-[90px] bg-white rounded-br-[20px] sm:rounded-br-[30px] lg:rounded-br-[40px] flex items-center justify-between lg:justify-start px-4 sm:px-6 lg:pl-12 lg:pr-16 z-20 drop-shadow-[0px_10px_20px_rgba(0,0,0,0.5)] lg:after:content-[''] lg:after:absolute lg:after:-right-[40px] lg:after:top-0 lg:after:w-[40px] lg:after:h-[40px] lg:after:bg-transparent lg:after:rounded-tl-[40px] lg:after:shadow-[-20px_-20px_0_20px_#ffffff]">
                <div className="font-michroma text-[22px] sm:text-[26px] lg:text-[28px] font-bold text-black lg:mr-[80px] shrink-0 mt-[2px]">ACN</div>
                <nav className="hidden lg:flex items-center gap-[40px]">
                    {NAV_TABS.map((link) => (
                        <button
                            key={link.id}
                            type="button"
                            onClick={() => navigate(link.path)}
                            className={`font-michroma bg-transparent border-none cursor-pointer no-underline text-[#888] text-[12px] font-bold tracking-[1.5px] transition-all duration-300 hover:text-black hover:[text-shadow:0_0_1px_rgba(0,0,0,0.2)] ${location.pathname === link.path ? '!text-black [text-shadow:0_0_1px_rgba(0,0,0,0.2)]' : ''}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full border border-black/10 bg-white text-black cursor-pointer shrink-0"
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[64px] sm:top-[72px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/5 px-4 py-4 lg:hidden"
                    >
                        <nav className="flex flex-col gap-1">
                            {NAV_TABS.map((link) => (
                                <button
                                    key={link.id}
                                    type="button"
                                    onClick={() => {
                                        navigate(link.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`font-michroma text-left bg-transparent border-none cursor-pointer no-underline text-black text-[13px] font-bold tracking-[1px] py-3 px-2 rounded-lg hover:bg-black/5 transition-colors ${location.pathname === link.path ? 'bg-black/5' : ''}`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Category Dropdown Overlay */}
            <AnimatePresence>
                {categoryDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="fixed inset-0 z-[45] bg-gradient-to-t from-black/90 via-black/40 to-black/10 backdrop-blur-md"
                    />
                )}
            </AnimatePresence>

            {/* Top Right Header Buttons */}
            <div className="absolute top-[76px] sm:top-[84px] lg:top-[30px] right-3 sm:right-4 lg:right-[120px] flex items-center gap-4 z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] max-w-[calc(100%-24px)]">
                {location.pathname === ROUTES.COLLECTION && setViewMode && (
                    <>                        {/* Category Dropdown */}
                        {categories && categories.length > 0 && (
                            <div className="relative hidden xl:block">
                                <button
                                    type="button"
                                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                    className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[14px] font-medium tracking-wide rounded-full py-3 px-6 hover:bg-black/60 hover:border-white/40 transition-all"
                                >
                                    <span>{activeCategory || 'Category'}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : ''}`}>
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {categoryDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 15 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-[calc(100%+12px)] right-0 w-[480px] bg-gradient-to-b from-[#2d2d2d] to-[#1f1f1f] border border-white/20 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.05)] overflow-hidden z-[100] p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3 px-2">
                                                <h4 className="text-white/70 font-michroma text-[10px] uppercase tracking-[2.5px] font-bold">Select Segment</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {categories.map((cat, index) => {
                                                    const detail = CATEGORY_DETAILS[cat] || { image: '/fortuner.png', desc: 'View Segment' };
                                                    const isActive = activeCategory === cat;
                                                    return (
                                                        <button
                                                            key={cat}
                                                            onClick={() => {
                                                                if (setActiveCategory) setActiveCategory(cat);
                                                                setCategoryDropdownOpen(false);
                                                            }}
                                                            className={`relative h-[115px] rounded-[16px] flex flex-col justify-end p-4 text-left overflow-hidden group transition-all duration-300 ${cat === 'All' ? 'col-span-2 h-[95px]' : ''} ${isActive ? 'ring-2 ring-[#da2525] ring-offset-2 ring-offset-[#2d2d2d] bg-[#1a1a1a]' : 'bg-[#111111] border border-white/10 hover:border-white/30 hover:bg-[#1a1a1a]'}`}
                                                        >
                                                            <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-[#da2525]/90 to-transparent' : 'bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/40'}`} />
                                                            <img
                                                                src={detail.image}
                                                                alt={cat}
                                                                className={`absolute ${cat === 'All' ? 'right-4 top-[-25px] w-[45%]' : '-right-6 -top-2 w-[130%]'} h-auto object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-x-2 transition-all duration-700`}
                                                            />
                                                            <div className="relative z-10 mt-auto">
                                                                <div className={`text-white font-bold tracking-wide ${cat === 'All' ? 'text-[15px]' : 'text-[13px]'}`}>{cat}</div>
                                                                <div className="text-white/60 text-[10px] mt-1 font-medium">{detail.desc}</div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Search Box */}
                        <div className="relative hidden sm:flex items-center group">
                            <div className="absolute left-4 text-white/50 group-focus-within:text-white transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search Cars..."
                                value={searchQuery || ''}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/20 backdrop-blur-md border border-white/10 text-white text-[14px] font-medium tracking-wide rounded-full py-3 pl-12 pr-5 w-[220px] lg:w-[280px] focus:outline-none focus:border-white/40 focus:bg-black/40 focus:ring-2 focus:ring-white/10 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all placeholder:text-white/40"
                            />
                            
                            {/* Search Dropdown */}
                            <AnimatePresence>
                                {searchQuery.trim().length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[calc(100%+12px)] left-0 w-[300px] bg-gradient-to-b from-[#2d2d2d] to-[#1f1f1f] border border-white/20 rounded-[20px] shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.05)] overflow-hidden z-[100] max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
                                    >
                                        {cars && cars.filter(car => 
                                            car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            car.model.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).length > 0 ? (
                                            cars.filter(car => 
                                                car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                car.model.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).map(car => (
                                                <div 
                                                    key={car.id}
                                                    onClick={() => {
                                                        if (onSelectCar) onSelectCar(car.id);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer rounded-[16px] transition-all duration-300 group mx-2 my-1"
                                                >
                                                    <div className="w-[84px] h-[56px] bg-[#111] rounded-[12px] flex items-center justify-center p-1.5 shrink-0 border border-white/5 group-hover:border-white/20 group-hover:bg-[#1a1a1a] transition-all duration-300 shadow-inner overflow-hidden relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <img src={car.image} alt={car.brand} className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 relative z-10" />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <div className="text-white text-[15px] font-bold font-michroma tracking-wide transition-colors">{car.brand}</div>
                                                        <div className="text-white/60 text-[12px] font-medium tracking-wider mt-0.5 transition-colors">{car.model}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-white/50 text-sm">No cars found</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* View Toggler */}
                        <div className="flex bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-1.5 gap-1.5">
                            <button
                                type="button"
                                onClick={() => setViewMode('carousel')}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${viewMode === 'carousel' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
                                aria-label="Carousel View"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
                                aria-label="Grid View"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Header;
