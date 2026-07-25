import { useState, useEffect, useCallback } from 'react';
import { saveLocationToMongoDB } from '../api/locationApi';

// Dealership location (Madhapur, Hyderabad)
const SHOWROOM_LAT = 17.4483;
const SHOWROOM_LNG = 78.3915;

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10;
}

let initialAutoRequestDone = false;

export function useGeolocation() {
    const [location, setLocation] = useState(() => {
        const saved = localStorage.getItem('user_location');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                // Ignore parse errors
            }
        }
        return {
            lat: null,
            lng: null,
            city: null,
            distance: null,
            loading: false,
            error: null,
            granted: false,
        };
    });

    const [notificationPermission, setNotificationPermission] = useState(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            return Notification.permission;
        }
        return 'unsupported';
    });

    const requestNotificationPermission = useCallback(async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                setNotificationPermission(permission);
                if (permission === 'granted') {
                    try {
                        new Notification('123 Cars Notifications Activated! 🚗', {
                            body: 'You will receive updates on exclusive car offers, test drive slots, and dealership news.',
                            icon: '/favicon.ico',
                        });
                    } catch (e) {
                        // Ignore notification display error
                    }
                }
                return permission;
            } catch (err) {
                console.error('Error requesting notification permission:', err);
            }
        }
        return 'unsupported';
    }, []);

    const sendNotification = useCallback((title, options = {}) => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
                return new Notification(title, {
                    icon: '/favicon.ico',
                    ...options,
                });
            } catch (e) {
                console.error('Error sending notification:', e);
            }
        }
        return null;
    }, []);

    const requestLocation = useCallback(async () => {
        // Step 1: Ask for Notification permission FIRST if not yet prompted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            await requestNotificationPermission();
        }

        if (!navigator.geolocation) {
            setLocation((prev) => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                loading: false,
            }));
            return;
        }

        // Step 2: Ask for Location permission NEXT
        setLocation((prev) => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const dist = calculateDistance(latitude, longitude, SHOWROOM_LAT, SHOWROOM_LNG);

                let cityName = 'Detected Location';
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        cityName =
                            data.address?.city ||
                            data.address?.town ||
                            data.address?.suburb ||
                            data.address?.county ||
                            data.address?.state ||
                            'Detected Location';
                    }
                } catch (err) {
                    // Fallback to coordinates
                }

                const newLocation = {
                    lat: latitude,
                    lng: longitude,
                    city: cityName,
                    distance: dist,
                    loading: false,
                    error: null,
                    granted: true,
                };

                setLocation(newLocation);
                localStorage.setItem('user_location', JSON.stringify(newLocation));
                saveLocationToMongoDB(newLocation);
            },
            (err) => {
                let errorMsg = 'Failed to get location';
                if (err.code === err.PERMISSION_DENIED) {
                    errorMsg = 'Location permission denied';
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    errorMsg = 'Location information unavailable';
                } else if (err.code === err.TIMEOUT) {
                    errorMsg = 'Location request timed out';
                }
                setLocation((prev) => ({
                    ...prev,
                    loading: false,
                    error: errorMsg,
                    granted: false,
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, [requestNotificationPermission]);

    const requestAllPermissions = useCallback(async () => {
        // Step 1: Notification FIRST
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            await requestNotificationPermission();
        }
        // Step 2: Location NEXT
        requestLocation();
    }, [requestNotificationPermission, requestLocation]);

    const clearLocation = useCallback(() => {
        localStorage.removeItem('user_location');
        setLocation({
            lat: null,
            lng: null,
            city: null,
            distance: null,
            loading: false,
            error: null,
            granted: false,
        });
    }, []);

    // Automatically request permissions once on page load
    useEffect(() => {
        if (!initialAutoRequestDone) {
            initialAutoRequestDone = true;
            requestAllPermissions();
        }
    }, [requestAllPermissions]);

    return {
        ...location,
        notificationPermission,
        requestNotificationPermission,
        sendNotification,
        requestAllPermissions,
        requestLocation,
        clearLocation,
        showroomCoords: { lat: SHOWROOM_LAT, lng: SHOWROOM_LNG },
    };
}

