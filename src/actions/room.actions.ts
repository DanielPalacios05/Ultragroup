'use server';

import { Room, RoomType } from '@/domain/schemas/hotel.schema';

const API_URL = 'http://localhost:3001/api';

export async function getRooms(hotelId: string): Promise<Room[]> {
    try {
        const url = `${API_URL}/rooms?hotelId=${hotelId}`;
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

export async function getRoomTypes(hotelId: string): Promise<RoomType[]> {
    try {
        const url = `${API_URL}/roomtypes?hotelId=${hotelId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Error al obtener tipos de habitación');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('No se conectó al API de RoomTypes');
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

export async function deleteRoom(id: string) {
    try {
        const url = `${API_URL}/rooms/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Falló al eliminar habitación');
        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Error de conexión');
    }
}
