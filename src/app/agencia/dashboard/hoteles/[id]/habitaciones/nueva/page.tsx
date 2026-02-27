"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { RoomForm } from '@/components/rooms/RoomForm';
import { createRoom, getRoomTypes } from '@/actions/room.actions';
import { Room, RoomType } from '@/domain/schemas/hotel.schema';

export default function NuevaHabitacionPage({ params }: { params: { id: string } }) {
    const hotelId = params.id;
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const types = await getRoomTypes(hotelId);
                setRoomTypes(types);
            } catch (err) {
                console.error("Error al obtener los tipos de habitación:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
    }, [hotelId]);

    const handleCreate = async (data: Omit<Room, 'id'>) => {
        await createRoom(data);
    };

    if (loading) {
        return (
            <div className="w-full h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in duration-500 text-black">
            <div className="mb-6">
                <Link
                    href={`/agencia/dashboard/hoteles/${hotelId}/habitaciones`}
                    className="text-brand flex items-center gap-1 text-sm font-medium mb-4 hover:underline"
                >
                    <ChevronLeft size={16} /> Volver a Habitaciones
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight text-blue-400">
                    Registrar Habitación
                </h1>
            </div>

            <RoomForm
                hotelId={hotelId}
                roomTypes={roomTypes}
                onSubmitAction={handleCreate}
                submitLabel="Guardar Habitación"
            />
        </div>
    );
}
