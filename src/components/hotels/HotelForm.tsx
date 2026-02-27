"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/components/ui/RoleSwitcher';
import { hotelFormSchema, type Hotel, type HotelFormData } from '@/domain/schemas/hotel.schema';

interface HotelFormProps {
    initialData?: Hotel;
    onSubmitAction: (data: HotelFormData) => Promise<void>;
    submitLabel: string;
}

export function HotelForm({ initialData, onSubmitAction, submitLabel }: HotelFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<HotelFormData>({
        resolver: zodResolver(hotelFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            city: initialData.city,
            address: initialData.address,
            status: initialData.status
        } : {
            name: '',
            city: '',
            address: '',
            status: 'enabled'
        }
    });

    const onSubmit = async (data: HotelFormData) => {
        try {
            setServerError(null);

            const submissionData = {
                ...data,
            };

            await onSubmitAction(submissionData);
            router.push('/agencia/dashboard');
            router.refresh(); // Force Next.js to re-fetch the dashboard data
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
                <Input
                    id="name"
                    label="Nombre del Hotel"
                    placeholder="Ej. Hotel Paraíso"
                    {...register('name')}
                    error={errors.name?.message}
                />

                <Input
                    id="city"
                    label="Ciudad"
                    placeholder="Ej. Cartagena"
                    {...register('city')}
                    error={errors.city?.message}
                />

                <div className="md:col-span-2">
                    <Input
                        id="address"
                        label="Dirección"
                        placeholder="Ej. Calle 123 #45-67"
                        {...register('address')}
                        error={errors.address?.message}
                    />
                </div>


                <div className="flex w-full flex-col gap-1.5">
                    <label htmlFor="status" className="text-sm font-medium text-gray-700">Estado inicial</label>
                    <select
                        id="status"
                        {...register('status')}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
                            errors.status && "border-red-500 focus:ring-red-500"
                        )}
                    >
                        <option value="enabled">Activo</option>
                        <option value="disabled">Inactivo</option>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
