import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundVideo from '../../assets/Mahindra_Scorpio-N_parked_studio_202606251812.mp4';
import InventorySection from '../../components/inventorySection';
import OfferSection from '../../components/offerSection';
import TestimonialSection from '../../components/testimonialSection';
import Header from '../../components/header';
import { useGeolocation } from '../../hooks/useGeolocation';
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
        question: 'IS 123 A TRUSTED DEALERSHIP?',
        answer: 'YES — 123 IS A FULLY CERTIFIED DEALERSHIP WITH YEARS OF EXPERIENCE SERVING HAPPY CUSTOMERS ACROSS INDIA.',
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

const GreetingSlider = ({ geo }) => {
    const slides = useMemo(() => {
        const list = [
            {
                id: 1,
                tag: 'WELCOME TO 123 CARS',
                title: 'DRIVE YOUR DREAM TODAY',
                subtitle: "Hyderabad's premier luxury car dealership",
            },
            {
                id: 2,
                tag: 'PREMIUM SELECTION',
                title: 'WORLD-CLASS VEHICLES',
                subtitle: 'Handpicked quality cars with 150-point inspection',
            },
        ];
        if (geo.granted && geo.distance !== null) {
            list.push({
                id: 3,
                tag: 'NEARBY SHOWROOM',
                title: `YOU ARE ${geo.distance} KM AWAY`,
                subtitle: `You can visit our Madhapur showroom today — only ${geo.distance} km from ${geo.city || 'your location'}!`,
                isDistance: true,
            });
        } else {
            list.push({
                id: 3,
                tag: 'VISIT OUR SHOWROOM',
                title: 'VISIT US IN HYDERABAD',
                subtitle: 'Survey No. 19, Madhapur, Hyderabad • Open Mon-Sat',
                isDistance: false,
            });
        }
        return list;
    }, [geo.granted, geo.distance, geo.city]);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const active = slides[index % slides.length];

    return (
        <div className="mb-4 sm:mb-6">
            {/* Slide title & subtitle with AnimatePresence */}
            <div className="relative min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] flex flex-col justify-start">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <h1 className="font-michroma text-[32px] sm:text-[36px] md:text-[44px] lg:text-[50px] leading-[1.1] font-bold text-white uppercase [text-shadow:0_4px_30px_rgba(0,0,0,0.9),0_2px_10px_rgba(0,0,0,0.6)] tracking-tight">
                            {active.title}
                        </h1>
                        <p className="text-white/80 text-[12px] sm:text-[14px] font-medium tracking-wide mt-2 max-w-[480px] drop-shadow-md">
                            {active.subtitle}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Slide Dots */}
            <div className="flex gap-2 mt-2">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer p-0 ${i === index % slides.length ? 'w-8 bg-[#da2525]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function HomeScreen() {
    const navigate = useNavigate();
    const geo = useGeolocation();
    const [openFaqId, setOpenFaqId] = useState('01');
    const [spotlightIndex, setSpotlightIndex] = useState(0);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
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
            <div className="w-full h-[calc(100svh-16px)] sm:h-[calc(100svh-32px)] lg:h-[calc(100vh-2rem)] min-h-[500px] lg:min-h-[600px] bg-bg-dark rounded-[24px] sm:rounded-[30px] lg:rounded-[40px] relative overflow-hidden shrink-0 isolate [contain:paint]">

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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-[28%] sm:top-[34%] lg:top-[30%] left-4 sm:left-8 lg:left-[80px] right-4 sm:right-8 lg:right-auto text-white z-[5] max-w-[520px]"
                >
                    <GreetingSlider geo={geo} />
                    <div className="flex drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] w-fit max-w-full group">
                        <button type="button" onClick={() => navigate(ROUTES.COLLECTION)} className="font-michroma flex items-center bg-white/95 backdrop-blur-md text-black border-none h-[50px] sm:h-[56px] pr-6 sm:pr-10 pl-5 sm:pl-8 text-[13px] sm:text-[14px] font-bold tracking-[1px] cursor-pointer rounded-l hover:bg-white [clip-path:polygon(0_0,100%_0,calc(100%-15px)_100%,0_100%)] transition-colors">GET STARTED</button>
                        <button type="button" onClick={() => navigate(ROUTES.COLLECTION)} aria-label="Get started" className="bg-[#cc0000] text-white border-none w-[54px] sm:w-[60px] h-[50px] sm:h-[56px] flex items-center justify-center cursor-pointer rounded-r hover:bg-[#b30000] [clip-path:polygon(15px_0,100%_0,100%_100%,0_100%)] -ml-[10px] transition-colors duration-300 shrink-0">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-arrow-slide">
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
                <div
                    className="absolute bottom-4 left-4 right-4 sm:bottom-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-[440px] min-h-[110px] sm:min-h-[120px] sm:h-[150px] bg-white/95 backdrop-blur-xl sm:bg-white rounded-[20px] sm:rounded-none sm:rounded-tl-[40px] flex items-center p-3 sm:px-4 sm:pr-[30px] sm:pl-[25px] sm:py-0 z-10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] sm:shadow-[-10px_-10px_30px_rgba(0,0,0,0.4)] sm:before:content-[''] sm:before:absolute sm:before:right-0 sm:before:-top-[30px] sm:before:w-[30px] sm:before:h-[30px] sm:before:bg-[radial-gradient(circle_at_top_left,transparent_30px,#ffffff_30px)] sm:before:pointer-events-none sm:after:content-[''] sm:after:absolute sm:after:-left-[30px] sm:after:bottom-0 sm:after:w-[30px] sm:after:h-[30px] sm:after:bg-[radial-gradient(circle_at_top_left,transparent_30px,#ffffff_30px)] sm:after:pointer-events-none cursor-pointer border border-white/40 sm:border-none transition-transform hover:scale-[1.02] sm:hover:scale-100"
                    onClick={() => goToCollection({ carId: featuredCar.id, showDetails: true })}
                    onKeyDown={(e) => e.key === 'Enter' && goToCollection({ carId: featuredCar.id, showDetails: true })}
                    role="button"
                    tabIndex={0}
                >
                    <div className="relative w-[110px] h-[76px] sm:w-[170px] sm:h-[110px] mr-3 sm:mr-[20px] rounded-[14px] overflow-hidden bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0] shadow-inner shrink-0 flex items-center justify-center p-2">
                        <img className="w-full h-full object-contain drop-shadow-md" src={featuredCar.image} alt={`${featuredCar.brand} ${featuredCar.model}`} loading="lazy" />
                    </div>
                    <div className="flex flex-col grow justify-center min-w-0 pr-1">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-[6px]">
                            <div className="drop-shadow-[0_2px_4px_rgba(204,0,0,0.4)] bg-red-50 text-[#d32f2f] rounded-full p-1 sm:p-0 sm:bg-transparent">
                                <svg className="w-[14px] h-[14px] sm:w-[28px] sm:h-[28px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </div>
                            <p className="font-michroma text-[9px] sm:text-[11px] text-[#777] tracking-[1.5px] m-0 leading-none">FEATURED</p>
                        </div>
                        <h2 className="font-michroma text-[16px] sm:text-[20px] xl:text-[22px] text-black m-0 font-bold shrink-0 truncate leading-tight">{featuredCar.model}</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[#888] text-[10px] sm:hidden uppercase font-medium">{featuredCar.brand}</span>
                            <span className="hidden sm:inline-block text-[#ccc] mx-1">•</span>
                            <span className="text-[#d32f2f] font-michroma text-[12px] sm:text-[13px] tracking-wide">{featuredCar.price}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* About Us Section */}
            <section className="w-full max-w-[1400px] mx-auto py-2 md:py-4 px-4 sm:px-8 xl:px-10 overflow-hidden shrink-0">
                <div className="flex flex-col xl:flex-row xl:items-stretch xl:gap-[72px] min-w-0">
                    {/* Left Column — reel top, card bottom */}
                    <div className="flex flex-col justify-between xl:w-[38%] xl:max-w-[460px] xl:min-h-[640px] gap-12 xl:gap-5">
                        {/* Reel */}
                        <div className="flex flex-col">
                            <div className="relative w-full group cursor-pointer transition-all duration-500 group-hover:-translate-y-1 group-hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]" onClick={() => setIsVideoOpen(true)}>
                                <div className="rounded-[16px] overflow-hidden bg-gray-100 relative">
                                    <img src="/images/feature_reel.png" alt="Feature Reel" className="w-full h-[180px] sm:h-[220px] md:h-[240px] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                    <div className="absolute -bottom-px -right-px w-[72px] h-[72px] bg-[#fafafa] rounded-tl-[20px]"></div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-[64px] h-[64px] bg-[#b0b9b6] rounded-[14px] rounded-br-[8px] flex items-center justify-center z-10 shadow-md">
                                    <div className="absolute inset-0 rounded-[14px] rounded-br-[8px] border-[3px] border-[#b0b9b6] animate-ping opacity-75"></div>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="ml-0.5 relative z-10 transition-transform duration-300 group-hover:scale-110">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Book Test Drive Card */}
                        <div className="group/card relative bg-[#111] rounded-[24px] overflow-hidden text-left p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:-translate-y-2 border border-white/5 h-full min-h-[280px]">
                            {/* Abstract background elements */}
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#cc0000]/20 rounded-full blur-[50px] pointer-events-none transition-transform duration-700 group-hover/card:scale-150"></div>
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50 mix-blend-overlay z-0 pointer-events-none"></div>

                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-[44px] h-[44px] rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-white backdrop-blur-md shadow-inner">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="12" r="3"></circle>
                                            <line x1="12" y1="15" x2="12" y2="22"></line>
                                            <line x1="20" y1="8" x2="14" y2="10.5"></line>
                                            <line x1="4" y1="8" x2="10" y2="10.5"></line>
                                        </svg>
                                    </div>
                                    <span className="font-michroma text-[10px] text-white/70 tracking-[2px] font-bold uppercase mt-1">EXPERIENCE</span>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="font-michroma text-[28px] sm:text-[32px] font-bold text-white leading-[1.15] m-0 mb-4 drop-shadow-sm">
                                        Book a<br />Test Drive
                                    </h3>

                                    <p className="text-white/60 text-[11px] sm:text-[12px] leading-[1.8] max-w-[280px] font-normal tracking-[0.5px] uppercase m-0 mb-8">
                                        FEEL THE POWER AND LUXURY FIRSTHAND. SCHEDULE YOUR EXCLUSIVE DRIVE TODAY.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => goToTestDrive()}
                                className="relative z-10 flex items-center justify-between w-full bg-white text-black pl-6 pr-2 py-2 rounded-[16px] font-bold uppercase text-[11px] sm:text-[12px] tracking-[1px] hover:bg-[#cc0000] hover:text-white transition-all duration-300 group/btn shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_25px_rgba(204,0,0,0.3)] cursor-pointer border-none"
                            >
                                Schedule Now
                                <div className="w-[40px] h-[40px] rounded-[12px] bg-black/5 group-hover/btn:bg-white/20 flex items-center justify-center transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover/btn:translate-x-1 transition-transform">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column — about us top, cards bottom */}
                    {/* Right Column — about us top, cards bottom */}
                    <div className="flex flex-col flex-1 min-w-0 xl:min-h-[640px] gap-8 mt-10 xl:mt-0">
                        {/* About Us */}
                        <div className="flex flex-col gap-4 max-w-[600px]">
                            <h1 className="font-michroma text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-bold uppercase text-black m-0 tracking-tight">
                                Built for those<br />who choose differently.
                            </h1>
                            <p className="text-[#666] text-[13px] sm:text-[14px] leading-[1.8] tracking-[0.5px] uppercase m-0 font-medium border-l-2 border-[#cc0000] pl-4">
                                WORLD-CLASS VEHICLES, TOTAL TRANSPARENCY, AND ABSOLUTELY ZERO COMPROMISE ON QUALITY.
                            </p>
                        </div>

                        {/* Completely Redesigned Showcase Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
                            {/* Offer Card 1 - Financing */}
                            <div className="group relative bg-[#111] rounded-[24px] overflow-hidden text-left min-h-[260px] sm:min-h-[280px] shadow-lg transition-transform duration-500 hover:-translate-y-1 p-0 border-none flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 pointer-events-none"></div>
                                {/* Abstract/Pattern background instead of a specific car */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20 z-0 mix-blend-overlay"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-900/30 to-transparent z-0"></div>

                                <div className="relative z-20 p-6 sm:p-8 flex flex-col justify-between h-full grow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] text-white/80 tracking-[2px] font-bold uppercase">EASY FINANCING</span>
                                        </div>
                                        <span className="font-michroma text-[26px] sm:text-[32px] font-bold text-white leading-tight block">Lowest EMI<br />Options</span>
                                    </div>
                                    <div className="mt-6">
                                        <span className="text-[12px] text-white/70 font-medium block mb-4 max-w-[200px] leading-relaxed">Drive home your dream car with instant approval & zero hidden charges.</span>
                                        <button onClick={() => navigate(ROUTES.COLLECTION)} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[1px] transition-colors cursor-pointer">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Offer Card 2 - Special Deals */}
                            <div className="group relative bg-gradient-to-br from-[#f8f8f8] to-[#eaeaea] rounded-[24px] overflow-hidden text-left min-h-[260px] sm:min-h-[280px] shadow-sm transition-transform duration-500 hover:-translate-y-1 border border-gray-200 p-0 flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                                <div className="relative z-20 p-6 sm:p-8 flex flex-col justify-between h-full grow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-[6px] h-[6px] rounded-full bg-black"></div>
                                            <span className="text-[10px] text-gray-500 tracking-[2px] font-bold uppercase">FESTIVE OFFERS</span>
                                        </div>
                                        <span className="font-michroma text-[26px] sm:text-[32px] font-bold text-black leading-tight block">Up to ₹1L<br />Benefits</span>
                                    </div>

                                    <div className="flex justify-between items-end mt-6">
                                        <div className="flex-1">
                                            <span className="text-[12px] text-gray-600 font-medium block mb-4 max-w-[150px] leading-relaxed">On selected premium SUVs & Sedans this month.</span>
                                            <button onClick={() => navigate(ROUTES.COLLECTION)} className="bg-black hover:bg-red-700 text-white px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[1px] transition-colors cursor-pointer shadow-md">
                                                View Offers
                                            </button>
                                        </div>
                                        {/* A subtle graphic or icon instead of a huge car */}
                                        <div className="w-[80px] h-[80px] rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                                                <rect x="2" y="7" width="20" height="5"></rect>
                                                <line x1="12" y1="22" x2="12" y2="7"></line>
                                                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                                                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Spotlight Card - spans both columns on mobile */}
                            <div className="col-span-1 sm:col-span-2 relative bg-gradient-to-r from-red-600 to-red-800 rounded-[24px] overflow-hidden h-[240px] sm:h-[280px] flex items-center justify-between p-6 sm:p-10">
                                <div className="z-20 max-w-[50%]">
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white tracking-[2px] font-bold uppercase mb-3 border border-white/20">SPOTLIGHT</span>
                                    <h3 className="font-michroma text-[18px] sm:text-[28px] font-bold text-white leading-tight m-0">{spotlightCar.brand} {spotlightCar.model}</h3>

                                    <button
                                        type="button"
                                        onClick={() => goToCollection({ carId: spotlightCar.id, showDetails: true })}
                                        className="mt-6 sm:mt-8 px-5 py-2.5 bg-white text-red-700 text-[11px] sm:text-[12px] font-michroma font-bold uppercase tracking-[1px] rounded-[8px] hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                                    >
                                        EXPLORE DETAILS
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>
                                </div>

                                <img src={spotlightCar.image} alt={spotlightCar.model} className="absolute right-[-10%] sm:right-4 top-1/2 -translate-y-1/2 w-[70%] sm:w-[55%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] z-10" />

                                {/* Subtle background patterns */}
                                <div className="absolute right-0 top-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30 z-0 mix-blend-overlay"></div>

                                {/* Controls */}
                                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 z-20">
                                    <button
                                        type="button"
                                        onClick={() => cycleSpotlight(-1)}
                                        className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/10 transition-colors cursor-pointer"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => cycleSpotlight(1)}
                                        className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/10 transition-colors cursor-pointer"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>
                                </div>
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
            <section className="relative w-full max-w-[1400px] mx-auto pt-4 sm:pt-6 pb-2 flex flex-col items-center overflow-hidden shrink-0">
                <div className="flex flex-col items-center mb-10 sm:mb-14 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 sm:w-12 h-[2px] bg-red-600/30"></div>
                        <span className="text-red-600 font-michroma text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase">PARTNERS</span>
                        <div className="w-8 sm:w-12 h-[2px] bg-red-600/30"></div>
                    </div>
                    <h2 className="font-michroma text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.15] font-bold uppercase text-black text-center max-w-[900px] px-4 sm:px-6 tracking-tight">
                        The brands people actually<br className="hidden sm:block" /> dream about — all in one place
                    </h2>
                </div>

                <div className="w-full flex justify-center px-4 sm:px-6 relative z-10">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 max-w-[1200px]">
                        {brands.slice(0, 5).map((brand) => (
                            <button
                                type="button"
                                key={brand.name}
                                onClick={() => goToBrand(brand.name)}
                                className="group relative flex flex-col items-center justify-center w-[130px] h-[100px] sm:w-[180px] sm:h-[130px] bg-white rounded-[24px] border border-gray-200/60 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(204,0,0,0.12)] hover:-translate-y-2 hover:border-red-200 p-0 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-100"></div>
                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors duration-500"></div>

                                {brand.logo ? (
                                    <img src={brand.logo} alt={brand.name} className={`${brand.logoClass} w-[50%] h-[50%] object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 relative z-10 group-hover:scale-110`} loading="lazy" />
                                ) : (
                                    <span className="font-michroma text-[14px] sm:text-[18px] text-gray-400 group-hover:text-black uppercase font-bold transition-colors duration-300 relative z-10">{brand.name}</span>
                                )}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.COLLECTION)}
                            className="group relative flex flex-col items-center justify-center w-[130px] h-[100px] sm:w-[180px] sm:h-[130px] bg-gradient-to-br from-[#111] to-[#000] rounded-[24px] shrink-0 text-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(204,0,0,0.25)] hover:-translate-y-2 overflow-hidden border border-white/5"
                        >
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-600/20 rounded-full blur-[30px] group-hover:bg-red-600/40 transition-colors duration-500"></div>

                            <span className="relative z-10 font-michroma text-[28px] sm:text-[36px] font-bold text-white leading-none group-hover:text-white transition-colors duration-300 drop-shadow-md group-hover:-translate-y-2">{stats.brandCount}+</span>
                            <span className="relative z-10 font-sans text-[10px] sm:text-[11px] text-white/60 font-bold tracking-[0.15em] uppercase mt-2 leading-tight group-hover:text-white transition-colors duration-300 group-hover:-translate-y-2 opacity-100 group-hover:opacity-0">Explore<br />More</span>

                            <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative w-full py-4 md:py-6 px-4 sm:px-6 flex flex-col items-center shrink-0 -mt-2 md:-mt-4 overflow-hidden">
                <div className="relative z-10 w-full max-w-[780px] flex flex-col items-center">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-10 sm:mb-14 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 sm:w-12 h-[2px] bg-red-600/30"></div>
                            <span className="text-red-600 font-michroma text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase">FAQ</span>
                            <div className="w-8 sm:w-12 h-[2px] bg-red-600/30"></div>
                        </div>
                        <h2 className="font-michroma text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.15] font-bold uppercase text-black m-0 tracking-tight px-4">
                            Let us clear things up
                        </h2>
                        <p className="text-black/60 text-[11px] sm:text-[12px] leading-[1.8] tracking-[0.5px] uppercase m-0 mt-4 max-w-[460px] font-medium px-4">
                            WE ARE ALWAYS HERE TO HELP. NO QUESTION IS TOO SMALL.
                        </p>
                    </div>

                    {/* Accordion */}
                    <div className="w-full flex flex-col gap-4 mb-6 sm:mb-8">
                        {FAQ_ITEMS.map((item) => {
                            const isOpen = openFaqId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`w-full rounded-[24px] transition-all duration-300 overflow-hidden ${isOpen
                                        ? 'bg-gradient-to-br from-[#f8f8f8] to-[#f0f0f0] shadow-sm border border-transparent'
                                        : 'bg-white border border-[#e5e5e5] hover:border-[#ccc]'
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(item.id)}
                                        className={`w-full flex items-center justify-between gap-6 bg-transparent border-none cursor-pointer text-left px-6 sm:px-8 ${isOpen ? 'pt-6 pb-4 sm:pt-7 sm:pb-4' : 'py-6 sm:py-7'
                                            }`}
                                    >
                                        <span className={`font-michroma text-[14px] sm:text-[15px] uppercase leading-[1.5] pr-4 transition-colors ${isOpen ? 'text-[#cc0000] font-bold' : 'text-black font-semibold'}`}>
                                            {item.question}
                                        </span>
                                        <span
                                            className={`shrink-0 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isOpen
                                                ? 'bg-[#cc0000] text-white rotate-180'
                                                : 'bg-white border border-gray-200 text-black'
                                                }`}
                                        >
                                            {isOpen ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="font-michroma text-[12px] sm:text-[13px] font-normal uppercase text-[#555] leading-[1.8] tracking-[0.02em] m-0 px-6 sm:px-8 pb-6 sm:pb-8 max-w-[640px]"
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
                    <div className="relative w-full mt-2 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg border border-gray-100">
                        <div className="relative bg-gradient-to-br from-[#f8f8f8] to-[#e8e8e8] px-6 sm:px-10 pt-8 sm:pt-10 pb-10 sm:pb-12">
                            <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-6">
                                <div className="flex shrink-0">
                                    <img className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full border-[3px] border-[#f0f0f0] object-cover relative z-[3] shadow-sm" src="https://i.pravatar.cc/100?img=33" alt="Team 1" />
                                    <img className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full border-[3px] border-[#f0f0f0] -ml-4 object-cover relative z-[2] shadow-sm" src="https://i.pravatar.cc/100?img=47" alt="Team 2" />
                                    <img className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full border-[3px] border-[#f0f0f0] -ml-4 object-cover relative z-[1] shadow-sm" src="https://i.pravatar.cc/100?img=12" alt="Team 3" />
                                </div>
                                <h3 className="font-michroma text-[18px] sm:text-[24px] font-bold text-black m-0 tracking-tight uppercase">
                                    Need clarity?
                                </h3>
                            </div>

                            <p className="text-[#666] text-[11px] sm:text-[13px] leading-[1.7] tracking-[0.03em] uppercase m-0 font-medium max-w-[480px]">
                                STILL NOT SURE? OUR TEAM IS JUST ONE CALL AWAY — READY TO HELP YOU WITH ANYTHING.
                            </p>

                            <div className="mt-8 sm:mt-10 min-h-[30px] flex items-end">
                                <a
                                    href="mailto:hello@123cars.com"
                                    className="text-[#cc0000] font-sans text-[12px] sm:text-[14px] font-bold tracking-[1px] uppercase no-underline hover:text-[#990000] transition-colors flex items-center gap-2"
                                >
                                    HELLO@123CARS.COM
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                            </div>

                            {/* Custom rounded cut-out mask using SVG */}
                            <svg
                                className="absolute bottom-0 right-0 w-[220px] sm:w-[300px] h-[60px] sm:h-[85px] pointer-events-none"
                                viewBox="0 0 275 75"
                                preserveAspectRatio="none"
                            >
                                <path d="M0,75 L10,75 C15,75 20,70 22,60 L38,20 C42,10 46,0 52,0 L275,0 L275,75 Z" fill="#fafafa" />
                            </svg>
                        </div>

                        {/* Buttons Container */}
                        <div className="absolute bottom-3 sm:bottom-5 right-4 sm:right-6 flex z-10 items-center gap-[6px]">
                            {/* CONTACT US BUTTON */}
                            <div
                                className="bg-[#cc0000] p-[2px] rounded-l-[8px] flex items-center justify-center relative shadow-lg"
                                style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)' }}
                            >
                                <button
                                    type="button"
                                    onClick={goToAbout}
                                    className="bg-white text-black h-[40px] sm:h-[46px] pl-6 pr-8 text-[11px] sm:text-[12px] font-bold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center rounded-l-[6px] font-sans uppercase tracking-[0.1em]"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                                >
                                    CONTACT
                                </button>
                            </div>

                            {/* RED CHEVRON BUTTON */}
                            <button
                                type="button"
                                onClick={goToAbout}
                                className="bg-[#cc0000] text-white h-[44px] sm:h-[50px] w-[46px] sm:w-[54px] flex items-center justify-center cursor-pointer hover:bg-[#aa0000] transition-colors rounded-[8px] skew-x-[-20deg] shadow-lg"
                            >
                                <div className="skew-x-[20deg] flex items-center justify-center ml-1">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-arrow-slide">
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
                                123.
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
                                    <a href="mailto:123cars.in@gmail.com" className="text-[11px] sm:text-[12px] uppercase no-underline hover:text-white transition-colors m-0 text-[#aaa]">
                                        123cars.in@gmail.com
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
                            <div className="flex items-center mt-6 w-full max-w-[540px] relative z-10 bg-white/[0.03] border border-white/10 rounded-[20px] sm:rounded-full backdrop-blur-md p-2 transition-all focus-within:bg-white/[0.08] focus-within:border-white/30 flex-col sm:flex-row gap-3 sm:gap-0 sm:h-[64px]">
                                <input
                                    type="email"
                                    placeholder="TYPE E-MAIL HERE"
                                    className="flex-1 w-full bg-white/5 sm:bg-transparent rounded-[14px] sm:rounded-none px-6 py-4 sm:py-0 text-[13px] sm:text-[14px] text-white placeholder-[#777] focus:outline-none tracking-[0.05em] h-[52px] sm:h-full"
                                />
                                <button type="button" className="w-full sm:w-auto sm:h-full bg-[#cc0000] hover:bg-[#b30000] text-white rounded-[14px] sm:rounded-full px-8 py-4 sm:py-0 text-[12px] sm:text-[13px] font-bold tracking-[0.1em] flex items-center justify-center gap-3 transition-colors duration-300 shadow-lg h-[52px]">
                                    <span>SUBSCRIBE</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
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
                        123
                    </div>
                </div>
            </footer>

            {/* Video Modal */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/90 backdrop-blur-sm"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-[1000px] aspect-video bg-black rounded-[24px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <iframe 
                                className="w-full h-full relative z-10" 
                                src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
