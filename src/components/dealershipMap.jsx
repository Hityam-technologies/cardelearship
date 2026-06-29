import React, { useRef, useEffect, useState } from 'react';

const MAP_EMBED_URL = 'https://maps.google.com/maps?q=Acn+cars&t=k&z=17&output=embed';

const DealershipMap = ({ className = '' }) => {
    const mapRef = useRef(null);
    const [showMap, setShowMap] = useState(false);

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
            className={`relative w-full aspect-[4/3] sm:aspect-[16/10] min-h-[200px] bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8e8e8] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
        >
            {showMap ? (
                <iframe
                    title="ACN Showroom Location Map"
                    src={MAP_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                />
            ) : (
                <div className="w-full h-full bg-[#f3f3f3] animate-pulse" aria-hidden="true" />
            )}
        </div>
    );
};

export default DealershipMap;
