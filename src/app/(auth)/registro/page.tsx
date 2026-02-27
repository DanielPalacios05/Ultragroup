"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { cn } from '@/components/ui/RoleSwitcher';
import { registroSchema, type RegistroFormValues } from '@/domain/schemas/auth.schema';
import { registerUser } from '@/actions/auth.actions';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.login);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegistroFormValues>({
        resolver: zodResolver(registroSchema),
    });

    const onSubmit = async (data: RegistroFormValues) => {
        try {
            setServerError(null);
            const user = await registerUser(data);
            // Generate a mock token or let the backend do it in a real scenario
            const mockToken = `mock-token-${user.id || 'new'}`;
            setAuth(mockToken, user);

            // Since registration is only for VIAJERO, we redirect there.
            router.push('/viajero/dashboard');
        } catch (error: unknown) {
            setServerError(error instanceof Error ? error.message : 'Ocurrió un error en el registro');
        }
    };

    return (
        <div className="min-h-screen bg-brand flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl overflow-hidden p-8 flex flex-col items-center">
                <div className="mb-6 flex flex-col items-center">
                    <Image
                        src="/cropped-favicon.png"
                        alt="UltraGroup Travel Logo"
                        width={60}
                        height={60}
                        className="mb-4"
                    />
                    <h1 className="text-xl font-bold text-gray-900 text-center">
                        Registro de Viajero
                    </h1>
                </div>

                {serverError && (
                    <div className="w-full bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                    <Input
                        id="name"
                        label="Nombre completo"
                        placeholder="John Doe"
                        {...register('name')}
                        error={errors.name?.message}
                    />

                    <Input
                        id="dob"
                        type="date"
                        label="Fecha de nacimiento"
                        {...register('dob')}
                        error={errors.dob?.message}
                    />

                    <div className="flex w-full flex-col gap-1.5">
                        <label htmlFor="gender" className="text-sm font-medium text-gray-700">Género</label>
                        <select
                            id="gender"
                            {...register('gender')}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
                                errors.gender && "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                        {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                    </div>

                    <div className="flex w-full flex-col gap-1.5">
                        <label htmlFor="documentType" className="text-sm font-medium text-gray-700">Tipo de documento</label>
                        <select
                            id="documentType"
                            {...register('documentType')}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
                                errors.documentType && "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="CC">Cédula</option>
                            <option value="TI">Tarjeta de identidad</option>
                            <option value="PASAPORTE">Pasaporte</option>
                            <option value="CE">Cédula de extranjería</option>
                        </select>
                        {errors.documentType && <p className="text-xs text-red-500">{errors.documentType.message}</p>}
                    </div>

                    <Input
                        id="documentNumber"
                        label="Número de documento"
                        placeholder="123456789"
                        {...register('documentNumber')}
                        error={errors.documentNumber?.message}
                    />

                    <Input
                        id="phone"
                        type="tel"
                        label="Teléfono"
                        placeholder="300 123 4567"
                        {...register('phone')}
                        error={errors.phone?.message}
                    />

                    <div className="md:col-span-2">
                        <Input
                            id="email"
                            type="email"
                            label="Correo electrónico"
                            placeholder="tu@correo.com"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    </div>

                    <Input
                        id="password"
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <Input
                        id="confirmPassword"
                        type="password"
                        label="Confirmar contraseña"
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand text-white rounded-full py-2.5 font-medium hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-brand font-semibold hover:underline">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
