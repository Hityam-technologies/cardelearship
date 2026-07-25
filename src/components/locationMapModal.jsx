import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function LocationMapModal({ geo, onClose }) {
    const userLat = geo.lat || 17.4483;
    const userLng = geo.lng || 78.3915;
    const showroomLat = geo.showroomCoords?.lat || 17.4483;
    const showroomLng = geo.showroomCoords?.lng || 78.3915;

    // Generate self-contained HTML with Leaflet & CartoDB Dark Matter map
    const mapHtml = useMemo(() => {
        const isGranted = geo.granted;
        const city = (geo.city || 'Your Location').replace(/'/g, "\\'");

        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; }
    body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #111111; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    
    .custom-showroom-pin {
      width: 32px; height: 32px; background: #da2525; border: 3px solid #ffffff; border-radius: 50%;
      box-shadow: 0 0 20px rgba(218,37,37,0.9); display: flex; align-items: center; justify-content: center;
      color: #ffffff; font-size: 14px;
    }
    
    .custom-user-pin {
      width: 28px; height: 28px; background: #00d2ff; border: 3px solid #ffffff; border-radius: 50%;
      box-shadow: 0 0 20px rgba(0,210,255,0.9); display: flex; align-items: center; justify-content: center;
      color: #ffffff; font-size: 12px;
    }
    
    .pulse-ring {
      position: absolute; width: 50px; height: 50px; margin-top: -9px; margin-left: -9px;
      border-radius: 50%; border: 2px solid #da2525; animation: pulse 2s infinite; pointer-events: none;
    }
    
    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    .leaflet-container { background: #111 !important; }
    .leaflet-popup-content-wrapper {
      background: #1e1e1e; color: #ffffff; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 14px; padding: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .leaflet-popup-tip { background: #1e1e1e; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var showroom = [${showroomLat}, ${showroomLng}];
    var userLat = ${userLat};
    var userLng = ${userLng};
    var isGranted = ${isGranted ? 'true' : 'false'};

    var map = L.map('map', { zoomControl: false, attributionControl: false });
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    var showroomIcon = L.divIcon({
      className: 'custom-pin-container',
      html: '<div class="pulse-ring"></div><div class="custom-showroom-pin">🏎️</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker(showroom, { icon: showroomIcon }).addTo(map).bindPopup('<div style="font-size:12px;font-weight:bold;padding:2px 4px;">123 Cars Showroom<br/><span style="font-weight:normal;opacity:0.7;">Madhapur, Hyderabad</span></div>');

    if (isGranted && (userLat !== showroom[0] || userLng !== showroom[1])) {
      var userPos = [userLat, userLng];
      var userIcon = L.divIcon({
        className: 'custom-user-pin-container',
        html: '<div class="custom-user-pin">📍</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(userPos, { icon: userIcon }).addTo(map).bindPopup('<div style="font-size:12px;font-weight:bold;padding:2px 4px;">Your Location<br/><span style="font-weight:normal;opacity:0.7;">${city}</span></div>');

      // Navigation line with curved feel
      var latlngs = [userPos, showroom];
      var polyline = L.polyline(latlngs, {
        color: '#da2525',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 10'
      }).addTo(map);

      map.fitBounds(L.latLngBounds([userPos, showroom]), { padding: [45, 45] });
    } else {
      map.setView(showroom, 13);
    }
  </script>
</body>
</html>`;
    }, [userLat, userLng, showroomLat, showroomLng, geo.granted, geo.city]);

    const estimatedDriveTime = geo.distance ? Math.max(5, Math.round(geo.distance * 2.2)) : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-lg flex items-center justify-center p-4 pointer-events-auto"
        >
            <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[500px] bg-[#141414] border border-white/15 rounded-[28px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white relative overflow-hidden flex flex-col gap-4"
            >
                {/* Header Section */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#da2525]/20 flex items-center justify-center border border-[#da2525]/40 text-[#da2525] shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="3 11 22 2 13 21 11 13 3 11" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-michroma text-[14px] sm:text-[15px] font-bold text-white uppercase m-0 tracking-wide truncate">
                                Navigation & Location
                            </h3>
                            <p className="text-white/50 text-[11px] m-0 truncate">123 Showroom • Madhapur, Hyderabad</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Notification Toggle Pill */}
                        {geo.notificationPermission === 'granted' ? (
                            <button
                                type="button"
                                onClick={() => geo.sendNotification('123 Cars Alert 🚗', { body: 'Notifications active!' })}
                                className="flex items-center gap-1.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
                                title="Notifications Enabled (Click to test)"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Alerts On
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => geo.requestNotificationPermission()}
                                className="flex items-center gap-1.5 bg-[#da2525]/20 hover:bg-[#da2525]/30 border border-[#da2525]/40 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
                                title="Enable Dealership Alerts"
                            >
                                🔔 Enable Alerts
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="text-white/50 hover:text-white bg-white/5 rounded-full w-8 h-8 flex items-center justify-center transition-colors border border-white/10 shrink-0 cursor-pointer"
                            aria-label="Close Modal"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Map Viewer Container */}
                <div className="relative w-full h-[250px] sm:h-[270px] rounded-[20px] overflow-hidden border border-white/15 shadow-inner bg-[#111]">
                    <iframe
                        title="Live Route Navigation Map"
                        srcDoc={mapHtml}
                        className="w-full h-full border-0"
                    />

                    {/* Floating Badges on Map */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[11px] text-white font-bold flex items-center gap-2 shadow-lg pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
                        <span className="truncate max-w-[150px]">
                            {geo.granted ? (geo.city || 'Your Location') : 'Location Pending'}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-[#da2525]/90 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-[11px] text-white font-michroma font-bold flex items-center gap-1.5 shadow-lg pointer-events-none">
                        <span>🏎️</span>
                        <span>Madhapur Showroom</span>
                    </div>
                </div>

                {/* Navigation Details Footer */}
                {geo.granted ? (
                    <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-xl bg-[#da2525]/15 flex items-center justify-center border border-[#da2525]/30 text-[#da2525] shrink-0 font-michroma font-bold text-[13px]">
                                {geo.distance}k
                            </div>
                            <div>
                                <div className="font-michroma text-[16px] font-bold text-white leading-tight">
                                    {geo.distance} <span className="text-[12px] text-white/70">KM AWAY</span>
                                </div>
                                <div className="text-white/50 text-[11px] mt-0.5">
                                    {estimatedDriveTime ? `Approx. ~${estimatedDriveTime} mins drive` : 'Madhapur, Hyderabad'}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${geo.lat},${geo.lng}&destination=${showroomLat},${showroomLng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial bg-[#da2525] hover:bg-[#b01e1e] text-white font-bold text-[12px] py-2.5 px-4 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#da2525]/30 no-underline flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                            >
                                Get Directions ↗
                            </a>
                            <button
                                type="button"
                                onClick={() => geo.requestLocation()}
                                className="bg-white/10 hover:bg-white/20 text-white font-bold text-[12px] px-3.5 py-2.5 rounded-xl transition-colors border border-white/10 cursor-pointer"
                                title="Refresh Location"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-white/70 text-[12px] text-center sm:text-left">
                            Enable location to calculate exact distance & view navigation route line.
                        </div>
                        <button
                            type="button"
                            onClick={() => geo.requestAllPermissions()}
                            disabled={geo.loading}
                            className="w-full sm:w-auto bg-[#da2525] hover:bg-[#b01e1e] text-white font-bold text-[12px] py-3 px-5 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#da2525]/30 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={geo.loading ? "animate-spin" : ""}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {geo.loading ? 'Locating...' : 'Show My Location & Route'}
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
