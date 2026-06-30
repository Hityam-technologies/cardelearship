import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Header from '../../components/header';

const SpeedometerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 12l4 4" />
    </svg>
);

const LightningIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const TorqueIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
);

const StarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const SPRING = { type: 'spring', stiffness: 260, damping: 32 };
const FADE = { duration: 0.4, ease: [0.4, 0, 0.2, 1] };

import { COLLECTION_CARS, getCategories } from '../../data/cars';
import { readCollectionParams, navigateToTestDrive, buildCollectionPath } from '../../utils/navigation';
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';

function BrandInfo({ car, isCenter }) {
    if (!car) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center text-center text-white"
        >
            <div className={`mb-4 ${isCenter ? 'opacity-100' : 'opacity-70'} flex items-center justify-center h-12`}>
                {car.logo && (
                    <img
                        src={car.logo}
                        alt={car.brand}
                        className={`${isCenter ? 'max-h-12 max-w-[120px]' : 'max-h-8 max-w-[80px]'} object-contain filter invert drop-shadow-md`}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}
            </div>
            <div className={`${isCenter ? 'text-3xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' : 'text-xl sm:text-base md:text-lg lg:text-2xl'} font-bold font-michroma mb-0.5 sm:mb-1 tracking-wide truncate max-w-full px-1`}>
                {car.brand}
            </div>
            <div className={`${isCenter ? 'text-sm sm:text-xs md:text-sm text-white/70' : 'text-xs sm:text-[10px] md:text-xs text-white/50'} tracking-wider truncate max-w-full px-1`}>
                {car.model}
            </div>
        </motion.div>
    );
}

function DetailCard({ title, badge, children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ ...FADE, delay }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md h-full"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">{title}</h3>
                {badge && <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">{badge}</span>}
            </div>
            {children}
        </motion.div>
    );
}

export default function CollectionScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [activeIndex, setActiveIndex] = useState(1);
    const [viewMode, setViewMode] = useState('carousel');
    const [activeCategory, setActiveCategory] = useState('All');
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();

    const categories = getCategories(COLLECTION_CARS);

    const filteredCars = COLLECTION_CARS.filter(car => {
        const matchesCategory = activeCategory === 'All' || car.type === activeCategory;
        return matchesCategory;
    });

    const totalCars = filteredCars.length;
    const progress = totalCars > 1 ? activeIndex / (totalCars - 1) : 0;
    const activeCar = filteredCars[activeIndex] || filteredCars[0];

    const urlCarId = searchParams.get('carId') ? Number(searchParams.get('carId')) : null;
    const isShowingDetails = searchParams.get('details') === 'true' && activeCar && urlCarId === activeCar.id;

    const goNext = useCallback(() => {
        setActiveIndex((prev) => Math.min(totalCars - 1, prev + 1));
    }, [totalCars]);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => Math.max(0, prev - 1));
    }, []);

    useEffect(() => {
        const pending = readCollectionParams(searchParams);
        if (pending.category) {
            setActiveCategory(pending.category);
            setActiveIndex(0);
        }
        if (pending.carId) {
            const idx = COLLECTION_CARS.findIndex((c) => c.id === pending.carId);
            if (idx !== -1) {
                setActiveCategory(pending.category || 'All');
                setActiveIndex(idx);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const pending = readCollectionParams(searchParams);
        if (location.state?.autoOpenDetails && pending.carId && !pending.showDetails) {
            navigate(buildCollectionPath({ carId: pending.carId, category: pending.category, details: true }), {
                state: null,
            });
        }
    }, [location.state, searchParams, navigate]);

    const handleViewDetails = useCallback(() => {
        if (!activeCar) return;
        navigate(buildCollectionPath({
            carId: activeCar.id,
            category: activeCategory !== 'All' ? activeCategory : undefined,
            details: true,
        }));
    }, [activeCar, activeCategory, navigate]);

    const handleCloseDetails = useCallback(() => {
        if (searchParams.get('details') !== 'true') return;
        navigate(buildCollectionPath({
            carId: urlCarId ?? activeCar?.id,
            category: searchParams.get('category') || undefined,
        }), { replace: true });
    }, [searchParams, navigate, urlCarId, activeCar]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isShowingDetails) {
                if (e.key === 'Escape') handleCloseDetails();
                return;
            }
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goNext, goPrev, isShowingDetails, handleCloseDetails]);

    const leftCar = activeIndex > 0 ? filteredCars[activeIndex - 1] : null;
    const rightCar = activeIndex < totalCars - 1 ? filteredCars[activeIndex + 1] : null;

    return (
        <div className="w-full max-w-full min-h-screen bg-[#fafafa] p-2 sm:p-4 flex flex-col overflow-x-clip box-border font-sans">
            <div className={`w-full bg-[#111111] rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] relative shrink-0 isolate h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] ${isShowingDetails ? 'min-h-[850px] lg:min-h-[640px] overflow-y-auto custom-scrollbar' : 'min-h-[640px] overflow-hidden [contain:paint]'}`}>
                <Header
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={(cat) => {
                        setActiveCategory(cat);
                        setActiveIndex(0);
                        navigate(buildCollectionPath({ category: cat !== 'All' ? cat : undefined }), { replace: true });
                    }}
                    cars={COLLECTION_CARS}
                    onSelectCar={(carId) => {
                        navigate(buildCollectionPath({ carId }), { replace: true });
                    }}
                />

                <motion.div
                    className="absolute top-0 bottom-0 z-0 bg-[#da2525]"
                    animate={{
                        clipPath: isShowingDetails
                            ? (isMobile
                                ? 'polygon(0% 72%, 100% 60%, 100% 100%, 0% 100%)'
                                : 'polygon(72% -20%, 95% -20%, 82% 120%, 58% 120%)')
                            : (isMobile
                                ? 'polygon(55% -20%, 100% -20%, 100% 120%, 35% 120%)'
                                : 'polygon(65% -20%, 90% -20%, 75% 120%, 50% 120%)'),
                    }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    style={{ width: '100%', height: '100%' }}
                />

                <LayoutGroup>
                    {/* Brand nav — hidden in detail view */}
                    <AnimatePresence>
                        {viewMode === 'carousel' && !isShowingDetails && (
                            <>
                                {/* Mobile / small tablet: active car only */}
                                <motion.div
                                    key="brand-nav-mobile"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={FADE}
                                    className="absolute top-[10.5rem] sm:top-[11rem] md:top-28 left-0 right-0 z-10 flex justify-center px-4 pointer-events-none lg:hidden"
                                >
                                    <div className="w-full max-w-[320px] sm:max-w-[400px]">
                                        <AnimatePresence mode="wait">
                                            <BrandInfo key={`mobile-${activeCar.id}`} car={activeCar} isCenter={true} />
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Desktop: three-column brand strip */}
                                <motion.div
                                    key="brand-nav-desktop"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={FADE}
                                    className="absolute top-28 w-full z-10 hidden lg:flex justify-center pointer-events-none"
                                >
                                    <div className="flex w-[90%] max-w-[1400px] justify-between relative h-32 items-center">
                                        <div className="absolute left-[33%] top-4 bottom-4 w-px bg-white/30" />
                                        <div className="absolute right-[33%] top-4 bottom-4 w-px bg-white/30" />
                                        <div className="w-[33%] flex justify-center px-2">
                                            <AnimatePresence mode="wait">
                                                {leftCar && <BrandInfo key={`left-${leftCar.id}`} car={leftCar} isCenter={false} />}
                                            </AnimatePresence>
                                        </div>
                                        <div className="w-[34%] flex justify-center px-2">
                                            <AnimatePresence mode="wait">
                                                <BrandInfo key={`center-${activeCar.id}`} car={activeCar} isCenter={true} />
                                            </AnimatePresence>
                                        </div>
                                        <div className="w-[33%] flex justify-center px-2">
                                            <AnimatePresence mode="wait">
                                                {rightCar && <BrandInfo key={`right-${rightCar.id}`} car={rightCar} isCenter={false} />}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Carousel Cars */}
                    <AnimatePresence initial={false}>
                        {filteredCars.map((car, index) => {
                            if (viewMode !== 'carousel' && !isShowingDetails) return null;
                            const offset = index - activeIndex;
                            const isCenter = offset === 0;

                            if (isTablet && !isCenter && !isShowingDetails) return null;
                            if (Math.abs(offset) > 1 || (isShowingDetails && !isCenter)) {
                                return null;
                            }

                            return (
                                <motion.div
                                    key={car.id}
                                    className={`absolute flex items-center justify-center origin-center ${isCenter ? (isShowingDetails ? 'pointer-events-none z-20' : 'cursor-pointer pointer-events-auto z-20') : 'pointer-events-none z-10'}`}
                                    initial={{
                                        top: isMobile ? '40%' : '50%',
                                        left: '50%',
                                        x: offset > 0 ? '20%' : offset < 0 ? '-120%' : '-50%',
                                        y: isMobile ? '-40%' : '-36%',
                                        scale: 0.6,
                                        opacity: 0,
                                        width: isMobile ? '85%' : '75%',
                                        maxWidth: isMobile ? 480 : 1100,
                                    }}
                                    animate={{
                                        top: isCenter && isShowingDetails ? (isMobile ? '45%' : '40%') : '50%',
                                        left: isCenter && isShowingDetails ? (isMobile ? '50%' : '1%') : '50%',
                                        x: isCenter ? (isShowingDetails ? (isMobile ? '-50%' : '0%') : '-50%') : (offset > 0 ? '20%' : '-120%'),
                                        y: isCenter && isShowingDetails ? '-50%' : (isMobile ? '-40%' : '-38%'),
                                        width: isCenter && isShowingDetails ? (isMobile ? '95%' : '48%') : (isMobile ? '85%' : '75%'),
                                        maxWidth: isCenter && isShowingDetails ? (isMobile ? 500 : 800) : (isMobile ? 480 : 1100),
                                        scale: isCenter ? 1 : 0.6,
                                        opacity: isCenter ? 1 : 0.4,
                                        zIndex: isCenter ? 20 : 15,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.4,
                                        x: offset > 0 ? '20%' : '-120%',
                                    }}
                                    transition={SPRING}
                                    onClick={() => {
                                        if (!isShowingDetails && isCenter) {
                                            setActiveIndex(activeIndex);
                                        }
                                    }}
                                >
                                    <motion.img
                                        src={car.image}
                                        alt={car.brand}
                                        className={`w-full h-auto object-contain drop-shadow-2xl select-none ${isMobile ? 'origin-center' : 'origin-top-left'}`}
                                        animate={{
                                            maxHeight: isCenter && isShowingDetails
                                                ? (isMobile ? '32vh' : '55vh')
                                                : (isMobile ? '48vh' : '75vh'),
                                            scale: isCenter && isShowingDetails ? (isMobile ? 1.3 : 1.1) : 1,
                                            opacity: isCenter ? 1 : 0.6,
                                        }}
                                        transition={SPRING}
                                        draggable={false}
                                    />
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 bg-white/5 blur-[40px] rounded-[100%] pointer-events-none"
                                        animate={{
                                            width: isCenter && isShowingDetails ? '60%' : '80%',
                                            height: isCenter && isShowingDetails ? 32 : 48,
                                            bottom: isCenter && isShowingDetails ? -12 : -24,
                                            opacity: isCenter ? 1 : 0,
                                        }}
                                        transition={SPRING}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Nav arrows — hidden in detail view */}
                    <AnimatePresence>
                        {viewMode === 'carousel' && !isShowingDetails && (
                            <motion.div key="nav-arrows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={FADE}>
                                <button
                                    onClick={goPrev}
                                    disabled={activeIndex === 0}
                                    className={`absolute left-2 sm:left-4 md:left-10 top-1/2 -translate-y-1/2 z-40 text-white transition-all duration-300 ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-70 hover:-translate-x-2 cursor-pointer'}`}
                                    aria-label="Previous car"
                                >
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={goNext}
                                    disabled={activeIndex === totalCars - 1}
                                    className={`absolute right-2 sm:right-4 md:right-10 top-1/2 -translate-y-1/2 z-40 text-white transition-all duration-300 ${activeIndex === totalCars - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-70 hover:translate-x-2 cursor-pointer'}`}
                                    aria-label="Next car"
                                >
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Browse mode bottom UI */}
                    <AnimatePresence>
                        {viewMode === 'carousel' && !isShowingDetails && (
                            <motion.div
                                key="browse-bottom"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={FADE}
                                className="absolute bottom-0 inset-x-0 z-30 pointer-events-none"
                            >
                                <div className="pointer-events-auto px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 md:pb-8 pt-12 sm:pt-16">
                                    <div className="max-w-[1400px] mx-auto flex flex-col gap-4 md:gap-5 lg:flex-row lg:items-end lg:justify-between">
                                        {/* Price + CTA */}
                                        <div className="order-2 lg:order-1 w-full lg:w-auto lg:max-w-[50%]">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`price-${activeCar.id}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    <div className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-1 sm:mb-2">{activeCar.price}</div>
                                                    <div className="text-white/60 text-[11px] sm:text-xs md:text-sm mb-3 sm:mb-4 tracking-wide">Inclusive of applicable buyer&apos;s Fee</div>
                                                </motion.div>
                                            </AnimatePresence>
                                            <button
                                                type="button"
                                                onClick={handleViewDetails}
                                                className="bg-transparent hover:bg-[#da2525] border-2 border-[#da2525] text-white rounded-full px-5 sm:px-8 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 transition-colors group w-full sm:w-auto justify-center sm:justify-start"
                                            >
                                                <span className="text-[14px] sm:text-[16px] font-medium tracking-wide">View Details</span>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1 shrink-0">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Stats + progress */}
                                        <div className="order-1 lg:order-2 flex flex-col gap-4 sm:gap-5 w-full lg:w-auto lg:items-end">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`stats-${activeCar.id}`}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="flex items-center justify-between sm:justify-center lg:justify-end gap-4 sm:gap-8 md:gap-10 lg:gap-12 w-full"
                                                >
                                                    <div className="flex flex-col items-center text-white min-w-0 flex-1 sm:flex-none">
                                                        <SpeedometerIcon />
                                                        <div className="text-[14px] sm:text-[16px] md:text-[18px] font-medium mt-2 sm:mt-3 mb-0.5 whitespace-nowrap">{activeCar.topSpeed}</div>
                                                        <div className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-widest text-center">Top Speed</div>
                                                    </div>
                                                    <div className="flex flex-col items-center text-white min-w-0 flex-1 sm:flex-none">
                                                        <LightningIcon />
                                                        <div className="text-[14px] sm:text-[16px] md:text-[18px] font-medium mt-2 sm:mt-3 mb-0.5 whitespace-nowrap">{activeCar.maxPower}</div>
                                                        <div className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-widest text-center">Max Power</div>
                                                    </div>
                                                    <div className="flex flex-col items-center text-white min-w-0 flex-1 sm:flex-none">
                                                        <TorqueIcon />
                                                        <div className="text-[14px] sm:text-[16px] md:text-[18px] font-medium mt-2 sm:mt-3 mb-0.5 whitespace-nowrap">{activeCar.torque}</div>
                                                        <div className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-widest text-center">Torque</div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>

                                            <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-4 w-full">
                                                <span className="text-white text-[14px] sm:text-[16px] font-medium w-5 shrink-0">
                                                    {String(activeIndex + 1).padStart(2, '0')}
                                                </span>
                                                <div
                                                    className="w-full max-w-[200px] sm:max-w-[120px] lg:w-[120px] h-[3px] bg-white/20 relative cursor-pointer rounded-full shrink"
                                                    onClick={(e) => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const ratio = (e.clientX - rect.left) / rect.width;
                                                        setActiveIndex(Math.max(0, Math.min(totalCars - 1, Math.round(ratio * (totalCars - 1)))));
                                                    }}
                                                >
                                                    <motion.div
                                                        className="absolute top-0 left-0 h-full bg-[#da2525] rounded-full"
                                                        animate={{ width: `${progress * 100}%` }}
                                                        transition={{ type: 'tween', duration: 0.3 }}
                                                    />
                                                    <motion.div
                                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-[#da2525] rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
                                                        animate={{ left: `calc(${progress * 100}% - 8px)` }}
                                                        transition={{ type: 'tween', duration: 0.3 }}
                                                        drag="x"
                                                        dragConstraints={{ left: 0, right: 0 }}
                                                        onDragEnd={(_, info) => {
                                                            if (info.offset.x > 20) goNext();
                                                            else if (info.offset.x < -20) goPrev();
                                                        }}
                                                    >
                                                        <div className="w-1 h-3 bg-white/40 rounded-full pointer-events-none" />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Detail view — car left, info right, cards bottom (laptop/desktop) */}
                    <AnimatePresence>
                        {isShowingDetails && (
                            <motion.div
                                key={`detail-layout-${activeCar.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={FADE}
                                className={`z-30 relative flex flex-col min-h-full ${isMobile ? 'px-4 pt-48 pb-10 gap-5' : 'pb-6'}`}
                            >
                                {/* Info panel — right on laptop, stacked on mobile */}
                                <motion.div
                                    initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    transition={{ ...FADE, delay: 0.15 }}
                                    className={isMobile
                                        ? 'relative w-full flex flex-col flex-1'
                                        : 'relative w-[48%] xl:w-[48%] ml-auto pt-[6%] xl:pt-[8%] flex flex-col gap-6 xl:gap-10 pr-[4%] z-30 flex-1'}
                                >
                                    <div className={`flex items-start justify-between gap-4 ${isMobile ? 'w-full' : ''}`}>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-white text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-medium tracking-wide mb-1">{activeCar.brand}</div>
                                            <div className="text-white/60 text-sm tracking-wider mb-2">{activeCar.model}</div>
                                            <div className="text-white/40 text-xs">{activeCar.color} · {activeCar.engine} · {activeCar.fuelType}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCloseDetails}
                                            className="shrink-0 text-white/70 hover:text-white text-sm flex items-center gap-1.5 border border-white/20 rounded-full px-4 py-2 transition-colors hover:border-white/40 hover:bg-white/5"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="18 15 12 9 6 15" />
                                            </svg>
                                            Close Details
                                        </button>
                                    </div>

                                    {/* Mobile spacer for absolute car */}
                                    {isMobile && <div className="w-full h-[28vh] min-h-[200px]" />}

                                    {/* Bottom Content Container for Mobile */}
                                    <div className={`flex flex-col gap-8 md:gap-6 xl:gap-8 ${isMobile ? 'mt-auto pt-6' : ''}`}>
                                        <div>
                                            <div className="text-white text-3xl lg:text-3xl xl:text-5xl font-medium tracking-tight mb-1">{activeCar.price}</div>
                                            <div className="text-white/50 text-sm">EMI from {activeCar.emi} · Inclusive of buyer's fee</div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-6 xl:gap-12 w-full">
                                            <div className="flex flex-col items-start text-white">
                                                <SpeedometerIcon />
                                                <div className="text-base xl:text-lg font-medium mt-2">{activeCar.topSpeed}</div>
                                                <div className="text-[10px] text-white/60 uppercase tracking-widest">Top Speed</div>
                                            </div>
                                            <div className="flex flex-col items-start text-white">
                                                <LightningIcon />
                                                <div className="text-base xl:text-lg font-medium mt-2">{activeCar.maxPower}</div>
                                                <div className="text-[10px] text-white/60 uppercase tracking-widest">Max Power</div>
                                            </div>
                                            <div className="flex flex-col items-start text-white">
                                                <TorqueIcon />
                                                <div className="text-base xl:text-lg font-medium mt-2">{activeCar.torque}</div>
                                                <div className="text-[10px] text-white/60 uppercase tracking-widest">Torque</div>
                                            </div>
                                            <div className="flex flex-col items-start text-white">
                                                <StarIcon />
                                                <div className="text-base xl:text-lg font-medium mt-2">{activeCar.rating}</div>
                                                <div className="text-[10px] text-white/60 uppercase tracking-widest">{activeCar.reviewCount} Reviews</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 lg:gap-6 relative">
                                            {isMobile && <div className="absolute -inset-x-10 -bottom-6 top-[-100px] bg-[#da2525] -z-10 pointer-events-none" />}
                                            <button
                                                type="button"
                                                className="bg-white hover:bg-gray-100 text-black rounded-full px-6 py-2.5 xl:px-8 xl:py-3 transition-colors text-sm font-bold tracking-wide shadow-lg shadow-black/10"
                                            >
                                                Enquire Now
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigateToTestDrive(navigate, activeCar.id)}
                                                className="bg-transparent hover:bg-white/10 border border-white/30 text-white rounded-full px-6 py-2.5 xl:px-8 xl:py-3 transition-colors text-sm font-medium tracking-wide"
                                            >
                                                Book Test Drive
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Bottom detail cards */}
                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 px-4 md:px-[5%] ${isMobile ? 'relative w-full mt-2' : 'relative w-full mt-6 xl:mt-8 z-30'}`}>
                                    <DetailCard title="Key Features" delay={0.2}>
                                        <ul className="space-y-1.5">
                                            {activeCar.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2 text-xs text-white/80">
                                                    <span className="text-[#da2525] font-bold">✓</span> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </DetailCard>

                                    <DetailCard title="Safety & Ratings" badge={activeCar.safetyRating} delay={0.28}>
                                        <div className="text-2xl text-white font-medium mb-2">
                                            ★ {activeCar.rating}
                                            <span className="text-sm text-white/50 font-normal ml-1">({activeCar.reviewCount} reviews)</span>
                                        </div>
                                        <ul className="space-y-1">
                                            {activeCar.safetyFeatures.map((s) => (
                                                <li key={s} className="text-xs text-white/70 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#da2525] shrink-0" /> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </DetailCard>

                                    <DetailCard title="Specifications" delay={0.36}>
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            {activeCar.specs.map((s) => (
                                                <div key={s.label} className="bg-white/5 rounded-lg px-2 py-1.5">
                                                    <div className="text-[10px] text-white/50">{s.label}</div>
                                                    <div className="text-xs text-white font-medium">{s.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-center border-t border-white/10 pt-2">
                                            <div>
                                                <div className="text-white text-xs font-medium">{activeCar.seats}</div>
                                                <div className="text-[10px] text-white/50">Seats</div>
                                            </div>
                                            <div>
                                                <div className="text-white text-xs font-medium">{activeCar.mileage}</div>
                                                <div className="text-[10px] text-white/50">Mileage</div>
                                            </div>
                                            <div>
                                                <div className="text-white text-xs font-medium">{activeCar.emi}</div>
                                                <div className="text-[10px] text-white/50">EMI</div>
                                            </div>
                                        </div>
                                    </DetailCard>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Grid View */}
                    <AnimatePresence>
                        {viewMode === 'grid' && !isShowingDetails && (
                            <motion.div
                                key="grid-view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 top-[11.5rem] sm:top-[10.5rem] md:top-[120px] lg:top-[140px] px-4 sm:px-8 lg:px-12 pb-8 overflow-y-auto z-20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                            >
                                {/* Grid Container */}
                                {filteredCars.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                                        {filteredCars.map(car => (
                                            <div
                                                key={car.id}
                                                className="bg-gradient-to-br from-[#1e1e1e] to-[#141414] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)] rounded-[28px] p-2.5 hover:from-[#242424] hover:to-[#1a1a1a] hover:border-white/50 hover:shadow-[0_12px_40px_rgba(218,37,37,0.15)] transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row items-stretch relative"
                                                onClick={() => {
                                                    navigate(buildCollectionPath({ carId: car.id, details: true }));
                                                }}
                                            >
                                                {/* Card Highlight Glow */}
                                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none"></div>

                                                {/* Image Side */}
                                                <div className="w-full sm:w-[45%] bg-black/40 rounded-[24px] p-4 flex items-center justify-center relative overflow-hidden shrink-0 min-h-[180px] shadow-inner">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#da2525]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
                                                    <img src={car.image} alt={car.brand} className="w-[115%] max-w-none h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:-translate-x-2 transition-transform duration-500 relative z-10" />
                                                </div>

                                                {/* Content Side */}
                                                <div className="w-full sm:w-[55%] p-4 sm:p-5 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="text-white font-bold text-xl lg:text-2xl tracking-tight">{car.brand}</h3>
                                                                <p className="text-gray-400 text-xs mt-1 font-medium">{car.model}</p>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-[#da2525] bg-[#da2525]/10 border border-[#da2525]/20 px-2 py-1 rounded-full uppercase tracking-wider">{car.type}</span>
                                                        </div>
                                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-bold text-2xl mb-4 mt-2">{car.price}</div>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <div className="flex items-center justify-between mb-4 bg-[#181818] rounded-[14px] p-3 border border-[#222]">
                                                            <div className="flex flex-col items-start">
                                                                <div className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-1">Power</div>
                                                                <div className="text-white font-bold text-xs">{car.maxPower}</div>
                                                            </div>
                                                            <div className="w-px h-6 bg-[#333]"></div>
                                                            <div className="flex flex-col items-start">
                                                                <div className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-1">Speed</div>
                                                                <div className="text-white font-bold text-xs">{car.topSpeed}</div>
                                                            </div>
                                                            <div className="w-px h-6 bg-[#333]"></div>
                                                            <div className="flex flex-col items-start">
                                                                <div className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-1">Rating</div>
                                                                <div className="text-white font-bold text-xs flex items-center gap-1">★ {car.rating}</div>
                                                            </div>
                                                        </div>
                                                        <button className="w-full py-2.5 rounded-[12px] bg-transparent border-2 border-white/60 text-white font-bold text-sm tracking-wide group-hover:bg-[#da2525] group-hover:text-white group-hover:border-[#da2525] transition-all duration-300">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center py-20 text-white/50">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <p className="text-lg font-medium">No cars found</p>
                                        <p className="text-sm">Try adjusting your search or category filters.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </LayoutGroup>
            </div>
        </div>
    );
}
