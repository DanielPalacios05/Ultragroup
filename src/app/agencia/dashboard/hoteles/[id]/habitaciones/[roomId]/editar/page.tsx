"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { RoomForm } from '@/components/rooms/RoomForm';
import { updateRoom } from '@/actions/room.actions';
import { Room } from '@/domain/schemas/hotel.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function EditarHabitacionPage({ params }: { params: Promise<{ id: string, roomId: string }> }) {
    const resolvedParams = use(params);
    const hotelId = resolvedParams.id;
    const roomId = resolvedParams.roomId;

    const router = useRouter();
    const [initialData, setInitialData] = useState<Room | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch room from mockoon
                const roomRes = await fetch(`${API_URL}/rooms/${roomId}`, { cache: 'no-store' });
                if (!roomRes.ok) throw new Error('No se pudo cargar la habitación');
                const roomData = await roomRes.json();

                setInitialData(roomData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error cargando habitación');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [hotelId, roomId]);

    const handleUpdate = async (data: Omit<Room, 'id'>) => {
        await updateRoom(roomId, data);
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
        );
    }

    if (error || !initialData) {
        return (
            <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in text-black">
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error || 'Habitación no encontrada'}</div>
                <button onClick={() => router.back()} className="text-brand underline hover:text-black mt-2">
                    Volver
                </button>
            </div>
        );
    }

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
                    Editar Habitación
                </h1>
            </div>

            <RoomForm
                initialData={initialData}
                hotelId={hotelId}
                onSubmitAction={handleUpdate}
                submitLabel="Guardar Habitación"
            />
        </div>
    );
}
