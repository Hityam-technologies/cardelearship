import { getApiUrl } from './config';

export const fetchCars = async () => {
    const response = await fetch(getApiUrl('/api/cars'));
    if (!response.ok) {
        throw new Error(`Error fetching cars: ${response.statusText}`);
    }
    return response.json();
};

export const fetchCategories = async () => {
    const response = await fetch(getApiUrl('/api/categories'));
    if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    return response.json();
};
