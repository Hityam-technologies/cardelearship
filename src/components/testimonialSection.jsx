import React from 'react';
import { motion } from 'framer-motion';

const CardBackground = ({ isBlue, startX = 220, image }) => {
    const endX = startX + 30;
    const pathD = `M 20 55 L ${startX} 55 C ${startX + 12} 55, ${endX - 12} 0, ${endX} 0 L 330 0 A 20 20 0 0 1 350 20 L 350 300 A 20 20 0 0 1 330 320 L 280 320 C 272 320, 268 360, 260 360 L 20 360 A 20 20 0 0 1 0 340 L 0 75 A 20 20 0 0 1 20 55 Z`;

    // Unique ID per card instance to prevent SVG collisions
    const maskId = React.useId().replace(/:/g, '');
    const gradientId = isBlue ? `blueGlow-${maskId}` : `greyGlow-${maskId}`;

    return (
        <svg
            viewBox="0 0 350 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full z-0"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                    <stop offset="40%" stopColor="#1d4ed8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id={`greyGlow-${maskId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.18)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.03)" />
                </linearGradient>
                {image && (
                    <mask id={`mask-${maskId}`}>
                        <path d={pathD} fill="white" />
                    </mask>
                )}
            </defs>

            {/* Card solid background / shape */}
            <path
                d={pathD}
                fill="#161616"
            />

            {/* If card has image, render it inside a masked foreignObject to prevent stretching */}
            {image && (
                <g mask={`url(#mask-${maskId})`}>
                    <foreignObject x="0" y="0" width="350" height="360">
                        <img
                            src={image}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block'
                            }}
                        />
                    </foreignObject>
                    {/* Add a dark overlay to ensure text readability */}
                    <path
                        d={pathD}
                        fill="rgba(0, 0, 0, 0.55)"
                    />
                </g>
            )}

            {/* Border Stroke */}
            <path
                d={pathD}
                stroke={`url(#${isBlue ? gradientId : `greyGlow-${maskId}`})`}
                strokeWidth="1.5"
            />
        </svg>
    );
};

const TestimonialCard = ({ name, role, text, rating, image, isBlue, carName, onClick }) => {
    const cardRef = React.useRef(null);
    const textRef = React.useRef(null);
    const [startX, setStartX] = React.useState(220);

    React.useEffect(() => {
        const updateWidth = () => {
            if (textRef.current && cardRef.current) {
                const textWidth = textRef.current.getBoundingClientRect().width;
                const cardWidth = cardRef.current.getBoundingClientRect().width || 350;

                // Convert textWidth to SVG coordinates (0-350 scale)
                const textWidthSvg = (textWidth / cardWidth) * 350;

                // Set S-curve starting position (add 20px padding start + 12px padding after text)
                const calculatedStart = Math.min(295, Math.max(130, 20 + textWidthSvg + 12));
                setStartX(calculatedStart);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [name, role]);

    return (
        <motion.div 
            ref={cardRef} 
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative w-[260px] sm:w-[280px] md:w-[300px] h-[280px] sm:h-[320px] shrink-0 snap-start ${onClick ? 'cursor-pointer' : ''}`}
            data-testimonial-card
            onClick={onClick}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* SVG Background with dynamic image support */}
            <CardBackground isBlue={isBlue} startX={startX} image={image} />

            {/* Card Content Wrapper */}
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between box-border">

                {/* Header: Name and Role (Sits in the lower left top cutout area) */}
                <div className="absolute top-[15px] left-[20px] flex flex-col items-start gap-[2px]">
                    <span
                        ref={textRef}
                        className="block font-michroma text-[12px] sm:text-[13px] font-bold text-white tracking-[0.5px] leading-none"
                    >
                        {name}
                    </span>
                    <span className="block font-michroma text-[#888] text-[9px] sm:text-[10px] tracking-[0.5px] uppercase font-semibold leading-none">
                        {role}
                    </span>
                </div>

                {/* Main content body (offset down by the top gap) */}
                <div className="mt-12 flex flex-col gap-3 h-full justify-end">

                    {/* Testimonial Text */}
                    <p className="text-white/90 text-[11px] sm:text-[12px] leading-[1.6] uppercase m-0 font-medium tracking-[0.3px] line-clamp-4">
                        {text}
                    </p>
                    {carName && (
                        <p className="text-[#da2525] text-[9px] sm:text-[10px] uppercase tracking-wider m-0 font-bold">
                            {carName}
                        </p>
                    )}

                    {/* Rating Footer */}
                    <div className="flex items-center gap-2 pb-1">
                        <div className="flex text-yellow-500 text-[12px] gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= Math.floor(rating) ? "text-yellow-500" : "text-white/20"}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-white/40 text-[10px] font-bold tracking-[0.5px]">
                            {rating}/5
                        </span>
                    </div>
                </div>
            </div>

            {/* Floating Double Quote Block */}
            <div className="absolute bottom-[-20px] right-[4px] w-[48px] h-[48px] flex items-center justify-center z-20 pointer-events-none opacity-95">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="white" className="rotate-180">
                    <path d="M14.017 21v-7.391c0-5.704 3.748-9.762 9-10.361v2.288c-3.142.569-4.887 2.603-5.117 6.103h4.1v9.361h-8zm-12 0v-7.391c0-5.704 3.748-9.762 9-10.361v2.288c-3.142.569-4.887 2.603-5.117 6.103h4.1v9.361h-8z" />
                </svg>
            </div>
        </motion.div>
    );
};

import { getTestimonialsWithCars, getDealershipStats } from '../data/cars';
import { navigateToCollection } from '../utils/navigation';
import { useNavigate } from 'react-router-dom';

const TestimonialSection = () => {
    const navigate = useNavigate();
    const scrollContainerRef = React.useRef(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            // Use a 20px threshold to handle fractional pixels and overscroll bouncing
            setCanScrollLeft(scrollLeft > 20);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 20);
        }
    };

    React.useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, []);

    const testimonials = getTestimonialsWithCars();
    const stats = getDealershipStats();

    const handleScrollLeftClick = () => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.querySelector('[data-testimonial-card]')?.getBoundingClientRect().width ?? 300;
            scrollContainerRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        }
    };

    const handleScrollRightClick = () => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.querySelector('[data-testimonial-card]')?.getBoundingClientRect().width ?? 300;
            scrollContainerRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
    };

    return (
        <section
            className="w-full max-w-full bg-black bg-cover bg-center py-10 sm:py-12 xl:py-16 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] overflow-hidden relative shrink-0 flex flex-col"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1602475063211-3d98d60e3b1f?q=80&w=1857&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}
        >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/80 pointer-events-none z-0" />
            
            {/* Wavy Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-12 relative z-10">

                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 xl:mb-10">
                    <div className="flex flex-col gap-3 max-w-[700px]">
                        <span className="text-primary-red font-michroma text-[11px] font-bold tracking-[2px] uppercase">
                            [ TESTIMONIAL_ ]
                        </span>
                        <h2 className="font-michroma text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.2] font-normal uppercase text-white m-0 tracking-wide">
                            Every review is a story<br />we are proud of
                        </h2>
                        <p className="text-text-muted text-[11px] sm:text-[12px] leading-[1.8] tracking-[0.4px] uppercase m-0 mt-1">
                            REAL REVIEWS FROM CUSTOMERS WHO DROVE HOME THEIR DREAM CARS.
                        </p>
                    </div>

                    {/* Navigation Buttons (Slanted) */}
                    <div className="flex gap-2 self-start md:self-end">
                        <button
                            onClick={handleScrollLeftClick}
                            style={{ transform: 'skewX(-15deg)' }}
                            className={`w-[50px] h-[36px] border-none rounded-[8px] flex items-center justify-center cursor-pointer transition-all ${canScrollLeft
                                    ? 'bg-primary-red text-white hover:bg-primary-red/90'
                                    : 'bg-white text-black hover:bg-white/90'
                                }`}
                        >
                            <span style={{ transform: 'skewX(15deg)' }} className="flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="11 17 6 12 11 7"></polyline>
                                    <polyline points="18 17 13 12 18 7"></polyline>
                                </svg>
                            </span>
                        </button>
                        <button
                            onClick={handleScrollRightClick}
                            style={{ transform: 'skewX(-15deg)' }}
                            className={`w-[50px] h-[36px] border-none rounded-[8px] flex items-center justify-center cursor-pointer transition-all ${canScrollRight
                                    ? 'bg-primary-red text-white hover:bg-primary-red/90'
                                    : 'bg-white text-black hover:bg-white/90'
                                }`}
                        >
                            <span style={{ transform: 'skewX(15deg)' }} className="flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="13 17 18 12 13 7"></polyline>
                                    <polyline points="6 17 11 12 6 7"></polyline>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Testimonials Carousel */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-6 -mt-4 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((t, index) => (
                        <TestimonialCard
                            key={`${t.name}-${index}`}
                            {...t}
                            onClick={t.carId ? () => navigateToCollection(navigate, { carId: t.carId, showDetails: true }) : undefined}
                        />
                    ))}
                </div>

                {/* Stats Footer Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-white/10 pt-6 xl:pt-8 mt-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-michroma text-[32px] sm:text-[40px] font-normal text-white leading-none">
                            {stats.happyCustomers}
                        </span>
                        <span className="text-text-muted text-[10px] tracking-[1.5px] uppercase font-semibold">
                            HAPPY CUSTOMERS SERVED
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-michroma text-[32px] sm:text-[40px] font-normal text-white leading-none">
                            {stats.avgRating}
                        </span>
                        <span className="text-text-muted text-[10px] tracking-[1.5px] uppercase font-semibold">
                            AVERAGE RATING
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-michroma text-[32px] sm:text-[40px] font-normal text-white leading-none">
                            {stats.modelCount}
                        </span>
                        <span className="text-text-muted text-[10px] tracking-[1.5px] uppercase font-semibold">
                            MODELS IN STOCK
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-michroma text-[32px] sm:text-[40px] font-normal text-white leading-none">
                            {stats.brandCount}+
                        </span>
                        <span className="text-text-muted text-[10px] tracking-[1.5px] uppercase font-semibold">
                            BRANDS AVAILABLE
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TestimonialSection;
