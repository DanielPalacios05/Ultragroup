'use server';

import { Hotel } from '@/domain/schemas/hotel.schema';

const API_URL = 'http://localhost:3001/api';

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
}

export async function getHotelById(id: string): Promise<Hotel> {
    try {
        console.log("ID", id)
        const url = `${API_URL}/hotels/${id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Important to skip cache for dynamic dashboard data
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error fetching hotel: ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error in getHotelById action:', error);
        throw new Error('Error al conectar con la base de datos de hoteles');
    }
}

export async function getHoteles(
    searchQuery?: string
): Promise<PaginatedResponse<Hotel>> {
    try {
        let url = `${API_URL}/hotels`;

        // In Mockoon CRUD, you can filter by any field.
        // the user asked to search by name OR city. Mockoon doesn't have an native OR filter without regex.
        // For simplicity, we could search against city natively.
        if (searchQuery) {
            // Since mockoon strictly matches filters like _eq or _like
            // Let's use name_like to search by name in a simple approximation
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Important to skip cache for dynamic dashboard data
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error fetching hotels: ${response.statusText}`);
        }

        // Mockoon returns metadata in headers
        const totalCount = parseInt(response.headers.get('x-total-count') || '0', 10);

        const data = await response.json();

        return {
            data,
            totalCount
        };

    } catch (error) {
        console.error('Error in getHoteles action:', error);
        throw new Error('Error al conectar con la base de datos de hoteles');
    }
}

export async function createHotel(data: Omit<Hotel, 'id'>) {
    try {
        const url = `${API_URL}/hotels`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al crear el hotel');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error creando hotel');
    }
}

export async function updateHotel(id: string, data: Hotel) {
    try {
        const url = `${API_URL}/hotels/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el hotel');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error actualizando hotel');
    }
}

export async function toggleHotelStatus(id: string, currentStatus: string) {
    try {
        const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
        const url = `${API_URL}/hotels/${id}`;
        // Using PATCH since mockoon supports partial updates
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error('Error al cambiar el estado');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error actualizando estado del hotel');
    }
}

export async function searchHotelsByCity(city: string): Promise<Hotel[]> {
    try {
        if (!city || city.trim() === '') return [];

        const url = `${API_URL}/hotels?city_like=${encodeURIComponent(city)}&status_eq=enabled`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error searching hotels: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in searchHotelsByCity action:', error);
        return [];
    }
}

