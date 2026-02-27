"use client";

import { HotelForm } from '@/components/hotels/HotelForm';
import { createHotel } from '@/actions/hotel.actions';
import { Hotel } from '@/domain/schemas/hotel.schema';

export default function NuevoHotelPage() {

    const handleCreate = async (data: Hotel) => {
        await createHotel(data);
    };

    return (
        <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in duration-500 text-black">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 font-mono tracking-tight text-blue-400">
                Registrar Nuevo Hotel
            </h1>

            <HotelForm
                onSubmitAction={handleCreate}
                submitLabel="Guardar Hotel"
            />
        </div>
    );
}
