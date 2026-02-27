'use server';

import { Room } from '@/domain/schemas/hotel.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getRooms(hotelId: string, status?: string): Promise<Room[]> {
    try {
        let url = `${API_URL}/rooms?hotelId_eq=${hotelId}`;
        if (status && status !== 'all') {
            url += `&status_eq=${status}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Error al obtener habitaciones');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('No se conectó al API de Rooms');
    }
}

export async function getRoomsByHotel(hotelId: string, status?: string): Promise<Room[]> {
    try {
        let url = `${API_URL}/rooms?hotelId_eq=${hotelId}`;
        if (status) {
            url += `&status_eq=${status}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getRoomsByHotel action:', error);
        return [];
    }
}

export async function createRoom(data: Omit<Room, 'id'>) {
    try {
        const url = `${API_URL}/rooms`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Falló al crear habitación');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error de conexión');
    }
}

export async function updateRoom(id: string, data: Partial<Room>) {
    try {
        const url = `${API_URL}/rooms/${id}`;
        // Using PATCH or PUT based on typical REST conventions, we'll use PATCH
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Falló al actualizar habitación');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error de conexión');
    }
}

// deleteRoom was removed as the requirement was exclusively "inhabilitar" (disabled status).
