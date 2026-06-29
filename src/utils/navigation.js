export const ROUTES = {
    HOME: '/',
    COLLECTION: '/collection',
    TEST_DRIVE: '/test-drive',
    ABOUT: '/about',
};

export const NAV_TABS = [
    { label: 'HOME', id: 'home', path: ROUTES.HOME },
    { label: 'COLLECTION', id: 'collection', path: ROUTES.COLLECTION },
    { label: 'ABOUT US', id: 'about', path: ROUTES.ABOUT },
    { label: 'TEST DRIVE', id: 'testdrive', path: ROUTES.TEST_DRIVE },
];

function buildPath(base, params = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== false && value !== '') {
            search.set(key, String(value));
        }
    });
    const query = search.toString();
    return query ? `${base}?${query}` : base;
}

export function buildCollectionPath({ carId, category, details = false } = {}) {
    const params = {};
    if (carId != null) params.carId = carId;
    if (category) params.category = category;
    if (details) params.details = 'true';
    return buildPath(ROUTES.COLLECTION, params);
}

export function navigateToCollection(navigate, { carId, category, showDetails = false } = {}) {
    if (showDetails && carId != null) {
        navigate(buildCollectionPath({ carId, category }), { state: { autoOpenDetails: true } });
        return;
    }
    navigate(buildCollectionPath({ carId, category }));
}

export function navigateToTestDrive(navigate, carId) {
    const params = carId != null ? { carId } : {};
    navigate(buildPath(ROUTES.TEST_DRIVE, params));
}

export function navigateToAbout(navigate) {
    navigate(ROUTES.ABOUT);
}

export function readCollectionParams(searchParams) {
    const carId = searchParams.get('carId');
    const category = searchParams.get('category');
    const showDetails = searchParams.get('details') === 'true';

    return {
        carId: carId ? Number(carId) : null,
        category: category || null,
        showDetails,
    };
}

export function readTestDriveParams(searchParams) {
    const carId = searchParams.get('carId');
    return carId ? Number(carId) : null;
}
