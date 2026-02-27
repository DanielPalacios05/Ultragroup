"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/components/ui/RoleSwitcher';
import { roomFormSchema, type Room, type RoomFormData } from '@/domain/schemas/hotel.schema';
import { getRoomsByHotel } from '@/actions/room.actions';

interface RoomFormProps {
    initialData?: Room;
    hotelId: string;
    onSubmitAction: (data: Omit<Room, 'id'>) => Promise<void>;
    submitLabel: string;
}

export function RoomForm({ initialData, hotelId, onSubmitAction, submitLabel }: RoomFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RoomFormData>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: initialData || {
            hotelId: hotelId,
            roomNumber: '',
            roomType: '',
            baseCost: 0,
            taxes: 0,
            location: '',
            status: 'available'
        }
    });

    const onSubmit = async (data: RoomFormData) => {
        try {
            setServerError(null);

            // Fetch rooms to validate duplicate code
            const currentRooms = await getRoomsByHotel(hotelId);
            const isDuplicate = currentRooms.some(room =>
                room.roomNumber === data.roomNumber && room.id !== initialData?.id
            );

            if (isDuplicate) {
                setServerError('Ya existe una habitación con este código/número en el hotel.');
                return;
            }

            await onSubmitAction(data as Omit<Room, 'id'>);
            router.push(`/agencia/dashboard/hoteles/${hotelId}/editar`);
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
                <input type="hidden" {...register('hotelId')} value={hotelId} />

                <div className="md:col-span-1">
                    <Input
                        id="roomNumber"
                        label="Número de Habitación"
                        placeholder="Ej. 101, A2"
                        maxLength={3}
                        {...register('roomNumber')}
                        error={errors.roomNumber?.message}
                    />
                </div>

                <div className="md:col-span-1">
                    <Input
                        id="roomType"
                        label="Tipo de Habitación"
                        placeholder="Ej. Sencilla, Doble, Suite"
                        {...register('roomType')}
                        error={errors.roomType?.message}
                    />
                </div>

                <Input
                    id="baseCost"
                    type="number"
                    label="Costo Base (COP)"
                    {...register('baseCost', { valueAsNumber: true })}
                    error={errors.baseCost?.message}
                />

                <Input
                    id="taxes"
                    type="number"
                    label="Impuestos (COP)"
                    {...register('taxes', { valueAsNumber: true })}
                    error={errors.taxes?.message}
                />

                <div className="md:col-span-2">
                    <Input
                        id="location"
                        label="Ubicación Física"
                        placeholder="Ej. Piso 5, Torre A"
                        {...register('location')}
                        error={errors.location?.message}
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
                        <option value="available">Disponible</option>
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
