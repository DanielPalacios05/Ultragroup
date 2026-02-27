"use server"

import { Reservation, ReservationFormData, reservationSchema } from '@/domain/schemas/reservation.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getReservationsByHotel(hotelId: string): Promise<Reservation[]> {
    try {
        const response = await fetch(`${API_URL}/reservations?hotelId_eq=${hotelId}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error al obtener reservas: ${response.statusText}`);
        }

        const data: Reservation[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        throw error;
    }
}

export async function createReservation(reservation: ReservationFormData): Promise<Reservation> {
    try {
        const payload = reservationSchema.omit({ id: true }).parse(reservation);

        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error al registrar reserva: ${response.statusText}`);
        }

        const newReservation: Reservation = await response.json();
        return newReservation;
    } catch (error) {
        console.error('Error creating reservation:', error);
        throw error;
    }
}
