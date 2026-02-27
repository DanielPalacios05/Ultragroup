"use client";

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { RoomForm } from '@/components/rooms/RoomForm';
import { createRoom } from '@/actions/room.actions';
import { Room } from '@/domain/schemas/hotel.schema';

export default function NuevaHabitacionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const hotelId = resolvedParams.id;

    const handleCreate = async (data: Omit<Room, 'id'>) => {
        await createRoom(data);
    };

    return (
        <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in duration-500 text-black">
            <div className="mb-6">
                <Link
                    href={`/agencia/dashboard/hoteles/${hotelId}/editar`}
                    className="text-brand flex items-center gap-1 text-sm font-medium mb-4 hover:underline"
                >
                    <ChevronLeft size={16} /> Volver al Hotel
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight text-blue-400">
                    Registrar Habitación
                </h1>
            </div>

            <RoomForm
                hotelId={hotelId}
                onSubmitAction={handleCreate}
                submitLabel="Guardar Habitación"
            />
        </div>
    );
}
