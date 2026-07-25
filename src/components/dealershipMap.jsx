import React, { useRef, useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const MAP_EMBED_URL = 'https://maps.google.com/maps?q=123+cars&t=k&z=17&output=embed';

const DealershipMap = ({ className = '' }) => {
    const mapRef = useRef(null);
    const [showMap, setShowMap] = useState(false);
    const geo = useGeolocation();

    useEffect(() => {
        const node = mapRef.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowMap(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={mapRef}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/10] min-h-[200px] bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8e8e8] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden group ${className}`}
        >
            {showMap ? (
                <>
                    <iframe
                        title="123 Showroom Location Map"
                        src={MAP_EMBED_URL}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                    />
                    
                    {/* Location Overlay Bar */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-white shadow-lg pointer-events-auto">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-[#da2525] animate-ping shrink-0" />
                            <span className="text-[11px] font-bold truncate">
                                {geo.granted
                                    ? `You are ${geo.distance} km from Showroom`
                                    : 'Madhapur, Hyderabad Showroom'}
                            </span>
                        </div>
                        {geo.granted ? (
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${geo.lat},${geo.lng}&destination=${geo.showroomCoords.lat},${geo.showroomCoords.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#da2525] hover:bg-[#b01e1e] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider transition-colors shrink-0 no-underline"
                            >
                                Directions
                            </a>
                        ) : (
                            <button
                                type="button"
                                onClick={() => geo.requestLocation()}
                                className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider transition-colors shrink-0 border border-white/10 cursor-pointer"
                            >
                                Locate Me
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="w-full h-full bg-[#f3f3f3] animate-pulse" aria-hidden="true" />
            )}
        </div>
    );
};

export default DealershipMap;
