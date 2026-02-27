"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Room, RoomType } from '@/domain/schemas/hotel.schema';
import { getRooms, getRoomTypes } from '@/actions/room.actions';

export default function HotelRoomsDashboard({ params }: { params: { id: string } }) {
    const hotelId = params.id;
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [roomsData, typesData] = await Promise.all([
                    getRooms(hotelId),
                    getRoomTypes(hotelId)
                ]);

                setRooms(roomsData);
                setRoomTypes(typesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar habitaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hotelId, refreshCount]);

    return (
        <div className="w-full flex-col flex animate-in fade-in duration-500 text-black">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex flex-col">
                    <Link
                        href="/agencia/dashboard"
                        className="text-brand flex items-center gap-1 text-sm font-medium mb-2 hover:underline"
                    >
                        <ChevronLeft size={16} /> Volver a Hoteles
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight text-blue-400">
                        Habitaciones
                    </h1>
                </div>

                <Link
                    href={`/agencia/dashboard/hoteles/${hotelId}/habitaciones/nueva`}
                    className="bg-brand text-white px-4 py-2 rounded-md font-medium hover:bg-black transition-colors"
                >
                    + Nueva Habitación
                </Link>
            </div>

            {loading && (
                <div className="w-full flex justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && rooms.length === 0 && (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-lg">No hay habitaciones registradas para este hotel.</p>
                </div>
            )}

            {/* Grid of Rooms */}
            {!loading && !error && rooms.length > 0 && (
                <div className="flex flex-row flex-wrap gap-6 mt-4">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            roomTypes={roomTypes}
                            hotelId={hotelId}
                            onUpdate={() => setRefreshCount(c => c + 1)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
