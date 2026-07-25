import { getApiUrl } from './config';

let lastSavedLocationKey = null;
let lastSavedTimestamp = 0;

/**
 * Saves user location coordinates to MongoDB backend (deduplicated)
 * @param {Object} locationData - Location object containing lat, lng, city, distance
 */
export const saveLocationToMongoDB = async (locationData) => {
    if (!locationData || locationData.lat === null || locationData.lng === null) {
        return;
    }

    const locationKey = `${Number(locationData.lat).toFixed(4)}_${Number(locationData.lng).toFixed(4)}`;
    const now = Date.now();

    // Prevent duplicate entries: skip if same location was saved in the last 10 minutes
    if (lastSavedLocationKey === locationKey && now - lastSavedTimestamp < 600000) {
        return;
    }

    lastSavedLocationKey = locationKey;
    lastSavedTimestamp = now;

    try {
        const response = await fetch(getApiUrl('/api/location'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: locationData.lat,
                lng: locationData.lng,
                city: locationData.city,
                distance: locationData.distance,
                timestamp: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            }),
        });

        if (!response.ok) {
            console.warn('Backend server response status:', response.status);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving location coordinates to MongoDB:', error);
        return null;
    }
};
