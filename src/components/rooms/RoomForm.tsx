"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/components/ui/RoleSwitcher';
import { roomSchema, type Room, type RoomType } from '@/domain/schemas/hotel.schema';

interface RoomFormProps {
    initialData?: Room;
    roomTypes: RoomType[];
    hotelId: string;
    onSubmitAction: (data: Omit<Room, 'id'>) => Promise<void>;
    submitLabel: string;
}

export function RoomForm({ initialData, roomTypes, hotelId, onSubmitAction, submitLabel }: RoomFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Room>({
        resolver: zodResolver(roomSchema),
        defaultValues: initialData || {
            id: 'new-room',
            hotelId: hotelId,
            roomTypeId: roomTypes[0]?.id || '',
            costoBase: 0,
            impuestos: 0,
            ubicacion: '',
            status: 'active'
        }
    });

    const onSubmit = async (data: Room) => {
        try {
            setServerError(null);

            // Exclude 'id' for submission logic if needed, Mockoon accepts without it on POST
            // But we pass the validated data directly to the action
            await onSubmitAction(data);

            router.push(`/agencia/dashboard/hoteles/${hotelId}/habitaciones`);
            router.refresh();
        } catch (error: unknown) {
            setServerError(error instanceof Error ? error.message : 'Error procesando el formulario');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            {serverError && (
                <div className="w-full bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">
                    {serverError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Oculto: el hotelId debe enviarse siempre */}
                <input type="hidden" {...register('hotelId')} value={hotelId} />

                <div className="flex w-full flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="roomTypeId" className="text-sm font-medium text-gray-700">Tipo de Habitación</label>
                    <select
                        id="roomTypeId"
                        {...register('roomTypeId')}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
                            errors.roomTypeId && "border-red-500 focus:ring-red-500"
                        )}
                    >
                        <option value="">Seleccione un tipo...</option>
                        {roomTypes.map(rt => (
                            <option key={rt.id} value={rt.id}>{rt.name} - {rt.description}</option>
                        ))}
                    </select>
                    {errors.roomTypeId && <p className="text-xs text-red-500">{errors.roomTypeId.message}</p>}
                </div>

                <Input
                    id="costoBase"
                    type="number"
                    label="Costo Base (COP)"
                    {...register('costoBase', { valueAsNumber: true })}
                    error={errors.costoBase?.message}
                />

                <Input
                    id="impuestos"
                    type="number"
                    label="Impuestos (COP)"
                    {...register('impuestos', { valueAsNumber: true })}
                    error={errors.impuestos?.message}
                />

                <div className="md:col-span-2">
                    <Input
                        id="ubicacion"
                        label="Ubicación Física"
                        placeholder="Ej. Piso 5, Torre A"
                        {...register('ubicacion')}
                        error={errors.ubicacion?.message}
                    />
                </div>

                <div className="flex w-full flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="status" className="text-sm font-medium text-gray-700">Estado</label>
                    <select
                        id="status"
                        {...register('status')}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
                            errors.status && "border-red-500 focus:ring-red-500"
                        )}
                    >
                        <option value="active">Activa</option>
                        <option value="maintenance">Ocupada / Mantenimiento</option>
                        <option value="disabled">Inhabilitada</option>
                    </select>
                    {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-black transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                    {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
