"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HotelForm } from '@/components/hotels/HotelForm';
import { updateHotel } from '@/actions/hotel.actions';
import { Hotel } from '@/domain/schemas/hotel.schema';

const API_URL = 'http://localhost:3001/api';

export default function EditarHotelPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [initialData, setInitialData] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                // We fetch directly from client here, though a Server Component reading from fetch could also work
                const res = await fetch(`${API_URL}/hotels/${params.id}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('No se pudo cargar el hotel');

                const data = await res.json();
                setInitialData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error cargando hotel');
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [params.id]);

    const handleUpdate = async (data: Hotel) => {
        await updateHotel(params.id, data);
    };

    if (loading) {
        return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;
    }

    if (error || !initialData) {
        return (
            <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in text-black">
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error || 'Hotel no encontrado'}</div>
                <button onClick={() => router.back()} className="text-brand underline">Volver</button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in duration-500 text-black">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 font-mono tracking-tight text-blue-400">
                Editar Hotel
            </h1>

            <HotelForm
                initialData={initialData}
                onSubmitAction={handleUpdate}
                submitLabel="Actualizar Hotel"
            />
        </div>
    );
}
