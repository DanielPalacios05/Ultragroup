"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormValues } from '@/domain/schemas/auth.schema';
import { loginUser, setAuthCookie } from '@/actions/auth.actions';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleSwitcher, type Role } from '@/components/ui/RoleSwitcher';

// In this simplified Mockoon implementation, we rely purely on email+pass to find the user.
// The role switcher here acts as UI dressing, though we could enforce that the fetched user.role matches the switcher role.
export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.login);

    const [role, setRole] = useState<Role>('viajero');
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setServerError(null);
            const expectedRole = role === 'agencia' ? 'AGENCIA' : 'VIAJERO';

            const { user, token } = await loginUser({
                ...data,
                role: expectedRole
            });

            // 1. Sync token to a HttpOnly cookie via Server Action so middleware can read it safely
            await setAuthCookie(token);

            // 2. Hydrate Zustand state
            setAuth(token, user);

            // 3. Redirect
            if (user.role === 'AGENCIA') {
                router.push('/agencia/dashboard');
            } else {
                router.push('/viajero/dashboard');
            }

        } catch (error: unknown) {
            setServerError(error instanceof Error ? error.message : 'Credenciales inválidas');
        }
    };

    return (
        <div className="min-h-screen bg-brand flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl overflow-hidden p-8 flex flex-col items-center">
                <div className="mb-6 flex flex-col items-center">
                    <Image
                        src="/cropped-favicon.png"
                        alt="UltraGroup Travel Logo"
                        width={80}
                        height={80}
                        className="mb-4"
                    />
                    <h1 className="text-xl font-bold text-gray-900 text-center">
                        Ultra<span className="text-brand">Group</span> Travel
                    </h1>
                </div>

                <div className="w-full mb-8 flex justify-center">
                    <RoleSwitcher role={role} onChange={setRole} />
                </div>

                {serverError && (
                    <div className="w-full bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="w-full text-black space-y-4">
                    <Input
                        id="email"
                        label="Correo electrónico"
                        type="email"
                        placeholder="tu@correo.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    <Input
                        id="password"
                        label="Contraseña"
                        type="password"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand text-white rounded-full mt-4 py-2.5 font-medium hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
                    </button>
                </form>

                {role === 'viajero' && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <Link href="/registro" className="text-brand font-semibold hover:underline">
                            Regístrate
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
