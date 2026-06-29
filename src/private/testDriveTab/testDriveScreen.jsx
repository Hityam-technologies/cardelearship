import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/header';
import { COLLECTION_CARS } from '../../data/cars';
import { readTestDriveParams } from '../../utils/navigation';

export default function TestDriveScreen() {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        carId: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredCarId, setHoveredCarId] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const pendingCarId = readTestDriveParams(searchParams);
        if (pendingCarId) {
            setFormData((prev) => ({ ...prev, carId: pendingCarId }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCarSelect = (carId) => {
        setFormData({ ...formData, carId });
        setIsDropdownOpen(false);
        setHoveredCarId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', phone: '', email: '', date: '', carId: '' });
        }, 3000);
    };

    let displayImage = '/fortuner.png'; 
    let isSilhouette = true;
    let activeCar = null;

    if (hoveredCarId) {
        const hoveredCar = COLLECTION_CARS.find(c => c.id === hoveredCarId);
        if (hoveredCar) {
            displayImage = hoveredCar.image;
            isSilhouette = false;
            activeCar = hoveredCar;
        }
    } else if (formData.carId) {
        const selectedCar = COLLECTION_CARS.find(c => c.id === Number(formData.carId) || c.id === formData.carId);
        if (selectedCar) {
            displayImage = selectedCar.image;
            isSilhouette = false;
            activeCar = selectedCar;
        }
    }

    const selectedCarModel = COLLECTION_CARS.find(c => c.id === formData.carId);

    return (
        <div className="w-full max-w-full min-h-screen bg-[#fafafa] p-2 sm:p-4 flex flex-col box-border font-sans">
            <div className="w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] bg-[#111111] rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] relative overflow-hidden flex flex-col isolate">
                
                <Header />

                {/* Abstract Background Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#da2525] rounded-full blur-[150px] opacity-20 pointer-events-none z-0" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#1a1a1a] rounded-full blur-[120px] opacity-80 pointer-events-none z-0" />

                <div className="flex-1 w-full flex flex-col lg:flex-row relative z-10 pt-[60px] lg:pt-[70px] px-6 lg:px-16 xl:px-24 pb-6 gap-8 lg:gap-8 items-center">
                    
                    {/* Left Side: Typography and Image */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center h-full relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <h1 className="text-white font-michroma text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] font-bold mb-4 tracking-tight uppercase [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] mt-4 transition-all duration-300 line-clamp-3 max-w-[90vw] overflow-hidden text-ellipsis">
                                {activeCar ? (
                                    <>
                                        <span className="block text-[20px] sm:text-[24px] lg:text-[28px] text-white/70 font-semibold tracking-widest mb-1">{activeCar.brand}</span>
                                        {activeCar.model}
                                    </>
                                ) : (
                                    <>
                                        Feel The <br className="hidden lg:block" /> Thrill
                                    </>
                                )}
                            </h1>
                            <p className="text-white/60 text-[13px] sm:text-[14px] leading-[1.6] font-medium max-w-[480px] mb-6 tracking-[0.5px]">
                                Get behind the wheel of your dream car. Book a test drive today and experience unparalleled performance and luxury firsthand.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="relative w-full lg:w-[110%] lg:-ml-[5%] mt-auto pointer-events-none"
                        >
                            {/* Glow behind car */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[50%] bg-gradient-to-t from-[#da2525]/50 to-transparent blur-[70px] rounded-full mix-blend-screen pointer-events-none" />
                            
                            <div className="relative w-full h-[40vh] lg:h-[45vh] flex items-end justify-center transform scale-[1.3] lg:scale-[1.55] translate-y-12 lg:translate-y-24 origin-bottom">
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={displayImage + isSilhouette}
                                        src={displayImage} 
                                        alt="Car Silhouette" 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                        className={`absolute bottom-0 max-w-full max-h-full object-contain z-10 transition-all duration-300 ${isSilhouette ? 'opacity-90' : 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]'}`}
                                        style={{ 
                                            transform: 'scaleX(-1)',
                                            filter: isSilhouette ? 'brightness(0) drop-shadow(0px 0px 2px rgba(255,255,255,1)) drop-shadow(0px 0px 15px rgba(255,255,255,0.5))' : ''
                                        }}
                                    />
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Booking Form */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="w-full max-w-[500px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-visible"
                        >
                            {/* Form Header */}
                            <div className="mb-6 relative z-10">
                                <h2 className="text-white font-michroma text-[20px] sm:text-[24px] font-bold mb-1">Book a Drive</h2>
                                <p className="text-white/50 text-[12px]">Please fill in your details below to schedule your visit.</p>
                            </div>

                            {/* Success Message Overlay */}
                            <AnimatePresence>
                                {isSubmitted && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-50 bg-[#111111]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-[24px] sm:rounded-[32px]"
                                    >
                                        <div className="w-16 h-16 bg-[#da2525]/20 rounded-full flex items-center justify-center mb-6">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#da2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </div>
                                        <h3 className="text-white font-michroma text-[20px] font-bold mb-2">Booking Confirmed!</h3>
                                        <p className="text-white/60 text-[14px]">Our team will contact you shortly to confirm your slot.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* The Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/70 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe" 
                                        className="w-full bg-black/40 border border-white/10 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-3.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <label className="text-white/70 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ml-1">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 90000 00000" 
                                            className="w-full bg-black/40 border border-white/10 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-3.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <label className="text-white/70 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ml-1">Date</label>
                                        <input 
                                            type="date" 
                                            name="date"
                                            required
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-3.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/70 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ml-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com" 
                                        className="w-full bg-black/40 border border-white/10 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-3.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
                                    <label className="text-white/70 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ml-1">Select Car Model</label>
                                    
                                    {/* Custom Select Box */}
                                    <div 
                                        className="w-full bg-black/40 border border-white/10 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-3.5 text-[13px] cursor-pointer flex justify-between items-center transition-colors hover:bg-black/60 min-w-0"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className={`truncate mr-4 flex-1 ${selectedCarModel ? "text-white" : "text-white/50"}`}>
                                            {selectedCarModel ? `${selectedCarModel.brand} ${selectedCarModel.model}` : 'Choose a car...'}
                                        </span>
                                        <div className={`text-white/50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Custom Dropdown List */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-[105%] left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-[12px] sm:rounded-[16px] p-2 shadow-2xl z-50 max-h-[180px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                                            >
                                                {COLLECTION_CARS.map(car => (
                                                    <div 
                                                        key={car.id}
                                                        className={`px-4 py-3 rounded-[8px] cursor-pointer text-[12px] sm:text-[13px] transition-colors truncate ${formData.carId === car.id ? 'bg-[#da2525] text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                                                        onMouseEnter={() => setHoveredCarId(car.id)}
                                                        onMouseLeave={() => setHoveredCarId(null)}
                                                        onClick={() => handleCarSelect(car.id)}
                                                    >
                                                        {car.brand} {car.model}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    
                                    {/* Hidden actual input for required form validation */}
                                    <input type="text" name="carId" value={formData.carId} required className="absolute opacity-0 pointer-events-none w-0 h-0" onChange={() => {}} />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full mt-2 bg-[#da2525] hover:bg-[#b01e1e] text-white font-bold text-[12px] tracking-[1px] uppercase rounded-[12px] sm:rounded-[16px] py-3.5 sm:py-4 transition-all duration-300 shadow-[0_10px_20px_rgba(218,37,37,0.3)] hover:shadow-[0_15px_30px_rgba(218,37,37,0.4)] hover:-translate-y-1"
                                >
                                    Confirm Booking
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
