"use client";

import { HotelForm } from '@/components/hotels/HotelForm';
import { createHotel } from '@/actions/hotel.actions';
import { HotelFormData } from '@/domain/schemas/hotel.schema';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NuevoHotelPage() {

    const handleCreate = async (data: HotelFormData) => {
        await createHotel(data);
    };

    return (
        <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in duration-500 text-black">
            <div className="mb-6">
                <Link
                    href="/agencia/dashboard"
                    className="text-brand flex items-center gap-1 text-sm font-medium mb-4 hover:underline"
                >
                    <ChevronLeft size={16} /> Regresar a Hoteles
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight text-blue-400">
                    Registrar Nuevo Hotel
                </h1>
            </div>

            <HotelForm
                onSubmitAction={handleCreate}
                submitLabel="Guardar Hotel"
            />
        </div>
    );
}
