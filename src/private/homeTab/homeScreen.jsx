import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundVideo from '../../assets/Mahindra_Scorpio-N_parked_studio_202606251812.mp4';
import InventorySection from '../../components/inventorySection';
import OfferSection from '../../components/offerSection';
import TestimonialSection from '../../components/testimonialSection';
import Header from '../../components/header';
import {
    COLLECTION_CARS,
    getUniqueBrands,
    getFeaturedCar,
    getFastestCar,
    getHighestTorqueCar,
    getDealershipStats,
} from '../../data/cars';
import { navigateToCollection, navigateToTestDrive, navigateToAbout, ROUTES } from '../../utils/navigation';

const FooterLink = ({ children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="text-left text-[#888] text-[12px] hover:text-[#cc0000] hover:translate-x-1 uppercase tracking-[0.08em] no-underline transition-all duration-300 font-medium bg-transparent border-none cursor-pointer p-0"
    >
        {children}
    </button>
);

const FAQ_ITEMS = [
    {
        id: '01',
        question: 'IS ACN A TRUSTED DEALERSHIP?',
        answer: 'YES — ACN IS A FULLY CERTIFIED DEALERSHIP WITH YEARS OF EXPERIENCE SERVING HAPPY CUSTOMERS ACROSS INDIA.',
    },
    {
        id: '02',
        question: "WHAT IF I DON'T LIKE THE CAR AFTER BUYING?",
        answer: 'WE HAVE A TRANSPARENT RETURN POLICY. YOUR SATISFACTION COMES FIRST — NO QUESTIONS ASKED.',
    },
    {
        id: '03',
        question: 'DO YOU OFFER EMI AND FINANCING OPTIONS?',
        answer: 'ABSOLUTELY. WE PARTNER WITH 15+ TOP BANKS ACROSS INDIA TO OFFER FLEXIBLE EMI PLANS WITH LOW INTEREST RATES.',
    },
    {
        id: '04',
        question: 'CAN I BOOK A TEST DRIVE ONLINE?',
        answer: 'YES — SIMPLY CONTACT OUR TEAM OR VISIT THE SHOWROOM. WE WILL SCHEDULE YOUR TEST DRIVE AT YOUR CONVENIENCE.',
    },
];

export default function HomeScreen() {
    const navigate = useNavigate();
    const [openFaqId, setOpenFaqId] = useState('01');
    const [spotlightIndex, setSpotlightIndex] = useState(0);
    const heroVideoRef = useRef(null);

    const fastestCar = useMemo(() => getFastestCar(), []);
    const torqueCar = useMemo(() => getHighestTorqueCar(), []);
    const featuredCar = useMemo(() => getFeaturedCar(), []);
    const brands = useMemo(() => getUniqueBrands(), []);
    const stats = useMemo(() => getDealershipStats(), []);
    const highlightCars = useMemo(() => [fastestCar, torqueCar, featuredCar], [fastestCar, torqueCar, featuredCar]);
    const spotlightCar = highlightCars[spotlightIndex % highlightCars.length];

    useEffect(() => {
        const video = heroVideoRef.current;
        if (!video) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.2 },
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    const goToCollection = (options) => navigateToCollection(navigate, options);
    const goToTestDrive = (carId) => navigateToTestDrive(navigate, carId);
    const goToAbout = () => navigateToAbout(navigate);

    const cycleSpotlight = (direction) => {
        setSpotlightIndex((prev) => {
            const next = prev + direction;
            if (next < 0) return highlightCars.length - 1;
            if (next >= highlightCars.length) return 0;
            return next;
        });
    };

    const goToBrand = (brandName) => {
        const car = COLLECTION_CARS.find((c) => c.brand === brandName);
        if (car) goToCollection({ carId: car.id });
        else navigate(ROUTES.COLLECTION);
    };

    return (
        <div className="w-full max-w-full min-h-screen bg-[#fafafa] p-2 sm:p-4 flex flex-col gap-6 sm:gap-8 md:gap-10 overflow-x-clip box-border">
            <div className="w-full min-h-[560px] sm:min-h-[620px] md:min-h-[680px] lg:h-[calc(100vh-2rem)] lg:min-h-[600px] bg-bg-dark rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] relative overflow-hidden shrink-0 isolate [contain:paint]">

                {/* Background Video */}
                <video
                    ref={heroVideoRef}
                    className="absolute inset-0 w-full h-full object-cover z-[1] [transform:translateZ(0)]"
                    src={backgroundVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/10 to-black/50 z-[2] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>

                <Header />

                {/* Main Content Texts */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-[38%] sm:top-[34%] lg:top-[30%] left-4 sm:left-8 lg:left-[80px] right-4 sm:right-8 lg:right-auto text-white z-[5] max-w-[520px]"
                >
                    <h1 className="font-michroma text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] mb-6 sm:mb-8 lg:mb-[40px] leading-[1.2] font-normal [text-shadow:0_4px_20px_rgba(0,0,0,0.8),0_2px_5px_rgba(0,0,0,0.5)]">DRIVE YOUR<br />DREAM TODAY</h1>
                    <div className="flex drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] w-fit max-w-full">
                        <button type="button" onClick={() => navigate(ROUTES.COLLECTION)} className="font-michroma bg-white text-black border-none py-3 sm:py-4 pr-6 sm:pr-10 pl-5 sm:pl-8 text-[12px] sm:text-[14px] font-normal cursor-pointer rounded-l hover:bg-[#f0f0f0] [clip-path:polygon(0_0,100%_0,calc(100%-15px)_100%,0_100%)]">GET STARTED</button>
                        <button type="button" onClick={() => navigate(ROUTES.COLLECTION)} aria-label="Get started" className="bg-primary-red text-white border-none w-[48px] sm:w-[60px] min-h-[44px] sm:min-h-[48px] flex items-center justify-center cursor-pointer rounded-r hover:bg-[#a00000] [clip-path:polygon(15px_0,100%_0,100%_100%,0_100%)] -ml-[10px] transition-colors duration-300 shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="13 17 18 12 13 7"></polyline>
                                <polyline points="6 17 11 12 6 7"></polyline>
                            </svg>
                        </button>
                    </div>
                </motion.div>

                {/* Stats on the right — desktop only */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hidden xl:flex absolute top-[35%] right-[120px] 2xl:right-[200px] text-white z-[5] flex-col gap-[40px]"
                >
                    <div>
                        <h2 className="font-michroma text-[32px] mb-[10px] font-normal [text-shadow:0_4px_15px_rgba(0,0,0,0.8)]">{featuredCar.maxPower}</h2>
                        <p className="font-michroma text-text-light text-[12px] tracking-[1px] opacity-80 m-0">Max Power</p>
                    </div>
                    <div>
                        <h2 className="font-michroma text-[32px] mb-[10px] font-normal [text-shadow:0_4px_15px_rgba(0,0,0,0.8)]">{featuredCar.mileage}</h2>
                        <p className="font-michroma text-text-light text-[12px] tracking-[1px] opacity-80 m-0">Mileage</p>
                    </div>
                </motion.div>

                {/* Right Scroll Tab — tablet/desktop */}
                <div className="hidden md:flex absolute right-0 top-[25%] w-[56px] lg:w-[70px] h-[220px] lg:h-[300px] bg-white rounded-tl-[28px] lg:rounded-tl-[35px] rounded-bl-[28px] lg:rounded-bl-[35px] flex-col items-center justify-center z-10 drop-shadow-[-10px_0_20px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:right-0 before:-top-[28px] lg:before:-top-[35px] before:w-[28px] lg:before:w-[35px] before:h-[28px] lg:before:h-[35px] before:bg-[radial-gradient(circle_at_top_left,transparent_28px,#ffffff_28px)] lg:before:bg-[radial-gradient(circle_at_top_left,transparent_35px,#ffffff_35px)] before:pointer-events-none after:content-[''] after:absolute after:right-0 after:-bottom-[28px] lg:after:-bottom-[35px] after:w-[28px] lg:after:w-[35px] after:h-[28px] lg:after:h-[35px] after:bg-[radial-gradient(circle_at_bottom_left,transparent_28px,#ffffff_28px)] lg:after:bg-[radial-gradient(circle_at_bottom_left,transparent_35px,#ffffff_35px)] after:pointer-events-none">
                    <div className="font-michroma [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 text-[11px] tracking-[2px] text-[#555] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">SCROLL DOWN</div>
                    <div className="mt-[20px] text-primary-red drop-shadow-[0_2px_4px_rgba(204,0,0,0.4)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                    </div>
                </div>

                {/* Bottom Right Customer Area */}
                <div className="absolute bottom-0 left-0 right-0 sm:left-auto sm:right-0 w-full sm:max-w-[440px] min-h-[120px] sm:h-[150px] bg-white rounded-t-[24px] sm:rounded-tl-[40px] sm:rounded-tr-none flex items-center px-4 sm:pr-[30px] sm:pl-[25px] py-3 sm:py-0 z-10 shadow-[-10px_-10px_30px_rgba(0,0,0,0.4)] sm:before:content-[''] sm:before:absolute sm:before:right-0 sm:before:-top-[30px] sm:before:w-[30px] sm:before:h-[30px] sm:before:bg-[radial-gradient(circle_at_top_left,transparent_30px,#ffffff_30px)] sm:before:pointer-events-none sm:after:content-[''] sm:after:absolute sm:after:-left-[30px] sm:after:bottom-0 sm:after:w-[30px] sm:after:h-[30px] sm:after:bg-[radial-gradient(circle_at_top_left,transparent_30px,#ffffff_30px)] sm:after:pointer-events-none cursor-pointer" onClick={() => goToCollection({ carId: featuredCar.id, showDetails: true })} onKeyDown={(e) => e.key === 'Enter' && goToCollection({ carId: featuredCar.id, showDetails: true })} role="button" tabIndex={0}>
                    <div className="relative w-[100px] h-[72px] sm:w-[170px] sm:h-[110px] mr-3 sm:mr-[20px] rounded-[12px] sm:rounded-[14px] overflow-hidden bg-[#f5f5f5] shadow-[-3px_6px_15px_rgba(0,0,0,0.3)] shrink-0">
                        <img className="w-full h-full object-contain" src={featuredCar.image} alt={`${featuredCar.brand} ${featuredCar.model}`} loading="lazy" />
                    </div>
                    <div className="flex flex-col grow justify-center min-w-0">
                        <div className="mb-1 sm:mb-[6px] drop-shadow-[0_2px_4px_rgba(204,0,0,0.3)]">
                            <svg className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px]" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                        </div>
                        <p className="font-michroma text-[10px] sm:text-[11px] text-[#777] mb-1 sm:mb-[6px] tracking-[1px] m-0">FEATURED — {featuredCar.brand.toUpperCase()}</p>
                        <div className="flex items-center gap-2 sm:gap-[12px] flex-wrap">
                            <h2 className="font-michroma text-[16px] sm:text-[20px] xl:text-[22px] text-black m-0 [text-shadow:0_2px_5px_rgba(0,0,0,0.1)] font-normal shrink-0 truncate">{featuredCar.model}</h2>
                            <span className="text-[#d32f2f] font-michroma text-[12px] sm:text-[13px]">{featuredCar.price}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* About Us Section */}
            <section className="w-full max-w-[1400px] mx-auto py-10 md:py-12 px-4 sm:px-8 xl:px-10 overflow-hidden shrink-0">
                <div className="flex flex-col xl:flex-row xl:items-stretch xl:gap-[72px] min-w-0">
                    {/* Left Column — reel top, global sourcing bottom */}
                    <div className="flex flex-col justify-between xl:w-[38%] xl:max-w-[460px] xl:min-h-[640px] gap-14 xl:gap-0">
                        {/* Reel */}
                        <div className="flex flex-col gap-5">
                            <div className="relative w-full">
                                <div className="rounded-[16px] overflow-hidden bg-gray-100 relative">
                                    <img src="/images/feature_reel.png" alt="Feature Reel" className="w-full h-[180px] sm:h-[220px] md:h-[240px] object-cover" loading="lazy" />
                                    <div className="absolute -bottom-px -right-px w-[72px] h-[72px] bg-[#fafafa] rounded-tl-[20px]"></div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-[64px] h-[64px] bg-[#b0b9b6] rounded-[14px] rounded-br-[8px] flex items-center justify-center cursor-pointer z-10">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="font-michroma text-[14px] font-bold text-black tracking-[1px] uppercase m-0">PAY REELS BY FEATURES</h3>
                        </div>

                        {/* Global Sourcing */}
                        <div className="flex flex-col gap-3">
                            <div className="text-[#d32f2f]">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"></ellipse>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <line x1="12" y1="2" x2="12" y2="22"></line>
                                </svg>
                            </div>
                            <h2 className="font-michroma text-[20px] font-bold tracking-[1.5px] m-0 uppercase text-black leading-tight">GLOBAL SOURCING</h2>
                            <p className="text-[#888] text-[12px] leading-[1.7] max-w-[300px] font-normal tracking-[0.5px] uppercase m-0">
                                HAND-PICKED FROM JAPAN, UK & UAE – QUALITY WITHOUT COMPROMISE.
                            </p>
                        </div>
                    </div>

                    {/* Right Column — about us top, cards bottom */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 xl:min-h-[640px] gap-14 xl:gap-0 mt-4 xl:mt-0">
                        {/* About Us */}
                        <div className="flex flex-col gap-3">
                            <button type="button" onClick={goToAbout} className="text-left bg-transparent border-none p-0 cursor-pointer">
                                <span className="text-[#d32f2f] font-michroma text-[12px] font-bold tracking-[2px]">[ ABOUT US_ ]</span>
                            </button>
                            <h1 className="font-michroma text-[34px] md:text-[44px] leading-[1.15] font-normal uppercase text-black m-0">
                                Built for those<br />who choose differently
                            </h1>
                            <p className="text-[#888] text-[12px] leading-[1.7] max-w-[520px] tracking-[0.5px] uppercase m-0">
                                WORLD-CLASS VEHICLES, TOTAL TRANSPARENCY, AND ABSOLUTELY ZERO COMPROMISE ON QUALITY.
                            </p>
                        </div>

                        {/* Cards and Navigation */}
                        <div className="flex flex-row flex-wrap items-end gap-4 w-full">
                            <button
                                type="button"
                                onClick={() => goToCollection({ carId: fastestCar.id, showDetails: true })}
                                className="bg-white border border-[#e0e0e0] rounded-[20px] pt-7 px-6 pb-0 w-[calc(50%-8px)] sm:w-[210px] h-[320px] flex flex-col items-center relative overflow-hidden cursor-pointer text-left hover:border-[#d32f2f]/40 transition-colors"
                            >
                                <span className="text-[10px] text-[#999] tracking-[2px] font-bold uppercase">TOP SPEED</span>
                                <span className="font-michroma text-[24px] mt-1 font-normal text-black text-center whitespace-nowrap">{fastestCar.topSpeed}</span>
                                <img src={fastestCar.image} alt={fastestCar.model} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[170px] object-contain" />
                            </button>

                            <button
                                type="button"
                                onClick={() => goToCollection({ carId: torqueCar.id, showDetails: true })}
                                className="bg-[#ececec] rounded-[20px] pt-7 px-6 pb-0 w-[calc(50%-8px)] sm:w-[210px] h-[320px] flex flex-col items-center relative overflow-hidden cursor-pointer text-left hover:ring-2 hover:ring-[#d32f2f]/30 transition-all"
                            >
                                <span className="text-[10px] text-[#999] tracking-[2px] font-bold uppercase">TORQUE</span>
                                <span className="font-michroma text-[24px] mt-1 font-normal text-black text-center whitespace-nowrap">{torqueCar.torque}</span>
                                <img
                                    src={torqueCar.image}
                                    alt={torqueCar.model}
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[170px] object-contain"
                                />
                            </button>

                            <div className="flex flex-col justify-between items-end w-full sm:w-[220px] sm:h-[320px] gap-4 sm:gap-0 shrink-0">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => cycleSpotlight(-1)}
                                        style={{ transform: 'skewX(-15deg)' }}
                                        className="w-[50px] h-[36px] border border-[#cc0000] rounded-[5px] flex items-center justify-center bg-white cursor-pointer text-[#cc0000] transition-all hover:bg-red-50/50"
                                    >
                                        <span style={{ transform: 'skewX(15deg)' }} className="flex items-center justify-center">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="11 17 6 12 11 7"></polyline>
                                                <polyline points="18 17 13 12 18 7"></polyline>
                                            </svg>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => cycleSpotlight(1)}
                                        style={{ transform: 'skewX(-15deg)' }}
                                        className="w-[50px] h-[36px] border-none rounded-[5px] flex items-center justify-center bg-[#cc0000] text-white cursor-pointer transition-all hover:bg-[#b30000]"
                                    >
                                        <span style={{ transform: 'skewX(15deg)' }} className="flex items-center justify-center">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="13 17 18 12 13 7"></polyline>
                                                <polyline points="6 17 11 12 6 7"></polyline>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => goToCollection({ carId: spotlightCar.id, showDetails: true })}
                                    className="rounded-[16px] overflow-hidden w-full sm:w-[220px] h-[140px] border-none p-0 cursor-pointer bg-[#ececec]"
                                >
                                    <img src={spotlightCar.image} alt={spotlightCar.model} className="w-full h-full object-contain" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inventory Section */}
            <InventorySection />

            {/* What We Offer Section */}
            <OfferSection />

            {/* Testimonials Section */}
            <TestimonialSection />

            {/* Brands Section */}
            <section className="w-full max-w-[1400px] mx-auto pt-12 sm:pt-14 md:pt-16 pb-2 md:pb-4 flex flex-col items-center overflow-hidden shrink-0">
                <h2 className="font-michroma text-[18px] sm:text-[24px] lg:text-[32px] leading-[1.25] font-bold uppercase text-black text-center max-w-[900px] mb-12 sm:mb-14 px-6 tracking-[0.06em]">
                    The brands people actually<br className="hidden sm:block" /> dream about — all in one place
                </h2>
                <div className="w-full flex justify-center px-6 overflow-x-auto py-4 -my-4 scrollbar-none">
                    <div className="flex items-center justify-center flex-nowrap min-w-max py-1">
                        {brands.slice(0, 5).map((brand, index) => (
                            <button
                                type="button"
                                key={brand.name}
                                onClick={() => goToBrand(brand.name)}
                                className="relative flex items-center justify-center w-[136px] h-[136px] sm:w-[156px] sm:h-[156px] bg-[#f3f3f3] rounded-full border-[6px] border-white -ml-[30px] sm:-ml-[34px] first:ml-0 shrink-0 shadow-sm cursor-pointer transition-transform duration-300 hover:scale-110 p-0"
                                style={{ zIndex: index + 1 }}
                            >
                                {brand.logo ? (
                                    <img src={brand.logo} alt={brand.name} className={`${brand.logoClass} w-auto h-auto object-contain`} loading="lazy" />
                                ) : (
                                    <span className="font-michroma text-[14px] text-black uppercase">{brand.name.slice(0, 3)}</span>
                                )}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.COLLECTION)}
                            className="relative flex flex-col items-center justify-center w-[136px] h-[136px] sm:w-[156px] sm:h-[156px] bg-[#f3f3f3] rounded-full border-[6px] border-white -ml-[30px] sm:-ml-[34px] shrink-0 text-center cursor-pointer shadow-sm transition-transform duration-300 hover:scale-110"
                            style={{ zIndex: brands.length + 1 }}
                        >
                            <span className="font-michroma text-[20px] sm:text-[24px] font-normal text-black leading-none">{stats.brandCount}+</span>
                            <span className="font-michroma text-[8px] sm:text-[9px] text-[#888] font-normal tracking-[0.1em] uppercase mt-1.5 leading-tight">More<br />Brands</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-10 md:py-14 px-4 sm:px-6 flex flex-col items-center shrink-0 -mt-2 md:-mt-4">
                <div className="w-full max-w-[780px] flex flex-col items-center">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center gap-2 mb-8 sm:mb-10">
                        <span className="text-[#999] font-michroma text-[10px] sm:text-[11px] font-normal tracking-[2px] uppercase">[ FAQ_ ]</span>
                        <h2 className="font-michroma text-[17px] sm:text-[22px] lg:text-[28px] leading-[1.15] font-bold uppercase text-black m-0 tracking-[0.05em] px-4">
                            Let us clear things up
                        </h2>
                        <p className="text-[#aaa] text-[10px] sm:text-[11px] leading-[1.7] tracking-[0.35px] uppercase m-0 mt-1 max-w-[460px] font-normal px-4">
                            WE ARE ALWAYS HERE TO HELP. NO QUESTION IS TOO SMALL.
                        </p>
                    </div>

                    {/* Accordion */}
                    <div className="w-full flex flex-col gap-4 mb-4">
                        {FAQ_ITEMS.map((item) => {
                            const isOpen = openFaqId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`w-full rounded-[20px] transition-colors duration-300 overflow-hidden ${isOpen
                                        ? 'bg-[#f5f5f5]'
                                        : 'bg-white border border-[#e5e5e5]'
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(item.id)}
                                        className={`w-full flex items-center justify-between gap-6 bg-transparent border-none cursor-pointer text-left px-6 sm:px-7 ${isOpen ? 'pt-5 pb-3 sm:pt-6 sm:pb-3' : 'py-5 sm:py-6'
                                            }`}
                                    >
                                        <span className="font-michroma text-[13px] sm:text-[14px] font-bold uppercase text-black leading-[1.55] pr-4 [-webkit-text-stroke:0.5px_black]">
                                            {item.question}
                                        </span>
                                        <span
                                            className={`shrink-0 w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen
                                                ? 'bg-[#c62828] text-white'
                                                : 'bg-white border border-black text-black'
                                                }`}
                                        >
                                            {isOpen ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="font-michroma text-[11px] sm:text-[12px] font-normal uppercase text-black leading-[1.75] tracking-[0.02em] m-0 px-7 sm:px-8 pb-7 sm:pb-8 max-w-[640px]"
                                            >
                                                {item.answer}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact CTA */}
                    <div className="relative w-full mt-1 rounded-[24px] sm:rounded-[28px] overflow-hidden">
                        <div className="relative bg-[#ebebeb] px-7 sm:px-9 pt-7 sm:pt-9 pb-8 sm:pb-9">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="flex shrink-0">
                                    <img className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full border-2 border-[#ebebeb] object-cover relative z-[3] shadow-sm" src="https://i.pravatar.cc/100?img=33" alt="Team 1" />
                                    <img className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full border-2 border-[#ebebeb] -ml-3 object-cover relative z-[2] shadow-sm" src="https://i.pravatar.cc/100?img=47" alt="Team 2" />
                                    <img className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full border-2 border-[#ebebeb] -ml-3 object-cover relative z-[1] shadow-sm" src="https://i.pravatar.cc/100?img=12" alt="Team 3" />
                                </div>
                                <h3 className="font-sans text-[20px] sm:text-[24px] font-medium text-black m-0 normal-case tracking-tight">
                                    Need more clarity?
                                </h3>
                            </div>

                            <p className="text-[#555] text-[11px] sm:text-[12px] leading-[1.6] tracking-[0.02em] uppercase m-0 font-normal max-w-[480px]">
                                STILL NOT SURE? OUR TEAM IS JUST ONE CALL AWAY — READY TO HELP<br className="hidden sm:block" /> YOU WITH ANYTHING YOU NEED.
                            </p>

                            <div className="mt-6 sm:mt-8 min-h-[30px] flex items-end">
                                <a
                                    href="mailto:hello@neurofly.com"
                                    className="text-[#d32f2f] font-sans text-[11px] sm:text-[12px] font-bold tracking-[0.5px] uppercase no-underline hover:opacity-80"
                                >
                                    HELLO@NEUROFLY.COM —
                                </a>
                            </div>

                            {/* Custom rounded cut-out mask using SVG */}
                            <svg
                                className="absolute bottom-0 right-0 w-[250px] sm:w-[275px] h-[65px] sm:h-[75px] pointer-events-none"
                                viewBox="0 0 275 75"
                                preserveAspectRatio="none"
                            >
                                <path d="M0,75 L10,75 C15,75 20,70 22,60 L38,20 C42,10 46,0 52,0 L275,0 L275,75 Z" fill="#fafafa" />
                            </svg>
                        </div>

                        {/* Buttons Container */}
                        <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 flex z-10 items-center gap-[6px]">
                            {/* CONTACT US BUTTON */}
                            <div
                                className="bg-black p-[1px] rounded-l-[6px] flex items-center justify-center relative shadow-sm"
                                style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                            >
                                <button
                                    type="button"
                                    onClick={goToAbout}
                                    className="bg-white text-black h-[38px] sm:h-[42px] pl-5 pr-7 text-[10px] sm:text-[11px] font-bold cursor-pointer hover:bg-[#f0f0f0] transition-colors flex items-center justify-center rounded-l-[5px] font-sans uppercase tracking-[0.05em]"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                                >
                                    CONTACT US
                                </button>
                            </div>

                            {/* BLACK CHEVRON BUTTON */}
                            <button
                                type="button"
                                onClick={goToAbout}
                                className="bg-black text-white h-[40px] sm:h-[44px] w-[42px] sm:w-[48px] flex items-center justify-center cursor-pointer hover:bg-[#222] transition-colors rounded-[6px] skew-x-[-20deg] shadow-sm"
                            >
                                <div className="skew-x-[20deg] flex items-center justify-center ml-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="13 17 18 12 13 7" />
                                        <polyline points="6 17 11 12 6 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer
                className="w-full bg-[#050505] rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col relative overflow-hidden shrink-0 min-h-0 sm:min-h-[500px] border border-white/10 shadow-2xl mt-2 sm:mt-4"
            >
                {/* Ambient Glows */}
                <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

                {/* Mesh background subtle pattern */}
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-screen"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.5'%3E%3Cpath d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/%3E%3Cpath d='M28 36 L56 52 L56 84 L28 100 L0 84 L0 52 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '56px 100px',
                    }}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
                    {/* Left Column (Brand, Info, Socials) */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <div>
                            <div className="font-michroma text-[36px] sm:text-[44px] font-bold leading-none tracking-tight bg-gradient-to-r from-white to-[#888] bg-clip-text text-transparent w-fit">
                                ACN.
                            </div>
                            <p className="text-[#888] text-[12px] sm:text-[13px] leading-[1.8] font-normal uppercase tracking-[0.05em] max-w-[360px] mt-6">
                                EVERY WEEK WE SHARE THE LATEST ARRIVALS, BEST DEALS, AND EXCLUSIVE OFFERS.
                            </p>

                            {/* Contact Details */}
                            <div className="flex flex-col gap-4 mt-8">
                                <div className="flex items-start gap-3 text-[#aaa]">
                                    <svg className="w-5 h-5 shrink-0 mt-0.5 text-[#cc0000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <p className="text-[11px] sm:text-[12px] leading-[1.6] uppercase m-0 max-w-[320px]">
                                        Survey No. 19, Kukatpally Housing Board - Hitech City Rd, opposite to Yashoda Hospital, Siddhi Vinayak Nagar, Madhapur, Hyderabad, 500081
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-[#aaa]">
                                    <svg className="w-4 h-4 shrink-0 text-[#cc0000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <a href="tel:+919234545678" className="text-[11px] sm:text-[12px] uppercase no-underline hover:text-white transition-colors m-0 text-[#aaa]">
                                        +91-9234545678
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-[#aaa]">
                                    <svg className="w-4 h-4 shrink-0 text-[#cc0000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <a href="mailto:acncars.in@gmail.com" className="text-[11px] sm:text-[12px] uppercase no-underline hover:text-white transition-colors m-0 text-[#aaa]">
                                        acncars.in@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 mt-2">
                            <span className="text-[#666] text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase">
                                FOLLOW US ON
                            </span>
                            <div className="flex gap-3">
                                {/* Social Icons (Circular, Sleek) */}
                                {[
                                    <svg key="ins" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
                                    <svg key="fb" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
                                    <svg key="in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
                                    <svg key="x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16m0-16L4 20"></path></svg>
                                ].map((icon, i) => (
                                    <a href="#" key={i} className="w-[42px] h-[42px] rounded-full border border-white/15 flex items-center justify-center text-[#aaa] hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg">
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="text-[#555] text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.05em] mt-8 lg:mt-auto">
                            2026 ©DESIGN MONKS. ALL RIGHTS RESERVED
                        </div>
                    </div>

                    {/* Right Columns (Links & Newsletter) */}
                    <div className="lg:col-span-7 flex flex-col gap-14 lg:gap-16">
                        {/* 3 Columns of Links */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-6">
                            <div className="flex flex-col gap-5 sm:gap-6">
                                <FooterLink onClick={() => navigate(ROUTES.COLLECTION)}>MODELS</FooterLink>
                                <FooterLink onClick={() => navigate(ROUTES.COLLECTION)}>BRANDS</FooterLink>
                                <FooterLink onClick={() => goToCollection({ carId: COLLECTION_CARS[0]?.id })}>NEW ARRIVALS</FooterLink>
                                <FooterLink onClick={() => navigate(ROUTES.COLLECTION)}>INVENTORY</FooterLink>
                            </div>
                            <div className="flex flex-col gap-5 sm:gap-6">
                                <FooterLink onClick={goToAbout}>ABOUT US</FooterLink>
                                <FooterLink onClick={goToAbout}>OUR STORY</FooterLink>
                                <FooterLink onClick={goToAbout}>VISIT US</FooterLink>
                                <FooterLink onClick={() => navigate(ROUTES.COLLECTION)}>COLLECTION</FooterLink>
                            </div>
                            <div className="flex flex-col gap-5 sm:gap-6">
                                <FooterLink onClick={() => goToTestDrive()}>TEST DRIVE</FooterLink>
                                <FooterLink onClick={() => navigate(ROUTES.COLLECTION)}>BROWSE CARS</FooterLink>
                                <FooterLink onClick={() => goToTestDrive(featuredCar.id)}>BOOK {featuredCar.brand}</FooterLink>
                                <FooterLink onClick={goToAbout}>CONTACT</FooterLink>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="flex flex-col gap-5">
                            <h3 className="font-michroma text-[20px] sm:text-[24px] font-normal text-white m-0">
                                Subscribe to our Newsletter
                            </h3>
                            <p className="text-[#888] text-[11px] sm:text-[12px] leading-[1.8] font-medium uppercase tracking-[0.05em] max-w-[480px] m-0">
                                GET THE LATEST CAR INSIGHTS, UPDATES, AND INNOVATIONS DELIVERED STRAIGHT TO YOUR INBOX.
                            </p>

                            {/* Premium Input Row */}
                            <div className="flex items-center mt-5 w-full max-w-[540px] min-h-[56px] sm:h-[60px] relative z-10 bg-white/5 border border-white/10 rounded-full backdrop-blur-md p-1.5 transition-all focus-within:bg-white/10 focus-within:border-white/30 flex-col sm:flex-row h-auto sm:h-[60px] gap-2 sm:gap-0">
                                <input
                                    type="email"
                                    placeholder="TYPE E-MAIL HERE"
                                    className="flex-1 w-full bg-transparent px-5 sm:px-6 py-3 sm:py-0 text-[12px] sm:text-[13px] text-white placeholder-[#666] focus:outline-none tracking-[0.05em] min-h-[44px] sm:min-h-0 sm:h-full"
                                />
                                <button type="button" className="w-full sm:w-auto sm:h-full bg-[#cc0000] hover:bg-[#aa0000] text-white rounded-full px-6 sm:px-8 py-3 sm:py-0 text-[11px] sm:text-[12px] font-bold tracking-[0.1em] flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg min-h-[44px]">
                                    <span>SUBSCRIBE</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
                                        <polyline points="5 12 19 12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Bottom Links */}
                        <div className="flex flex-wrap gap-8 sm:gap-12 mt-8 lg:mt-auto pt-8 border-t border-white/10">
                            <a href="#" className="text-[#666] text-[10px] sm:text-[11px] hover:text-white uppercase tracking-[0.1em] no-underline transition-colors font-bold">PRIVACY POLICY</a>
                            <a href="#" className="text-[#666] text-[10px] sm:text-[11px] hover:text-white uppercase tracking-[0.1em] no-underline transition-colors font-bold">TERMS & CONDITIONS</a>
                            <a href="#" className="text-[#666] text-[10px] sm:text-[11px] hover:text-white uppercase tracking-[0.1em] no-underline transition-colors font-bold">COOKIES</a>
                            <a href="#" className="text-[#666] text-[10px] sm:text-[11px] hover:text-white uppercase tracking-[0.1em] no-underline transition-colors font-bold">FAQ</a>
                        </div>
                    </div>
                </div>

                {/* Massive Background Text watermark */}
                <div className="absolute -bottom-[20px] sm:-bottom-[40px] lg:-bottom-[60px] left-0 w-full flex justify-center pointer-events-none select-none overflow-hidden z-0">
                    <div className="font-michroma text-[25vw] lg:text-[22vw] font-bold text-white/[0.02] leading-[0.75] tracking-tighter whitespace-nowrap mix-blend-screen">
                        ACN
                    </div>
                </div>
            </footer>
        </div>
    );
}
