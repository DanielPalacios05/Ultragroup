"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User, Building2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        // 1. Clear Zustand state
        logout();

        // 2. Clear cookie manually to remove Edge protection token instantly (client side)
        document.cookie = 'auth_token=; path=/; max-age=0';

        // 3. Redirect
        router.push('/login');
    };

    const isAgencia = user?.role === 'AGENCIA';

    return (
        <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
            {/* Brand Side */}
            <Link
                href={isAgencia ? "/agencia/dashboard" : "/viajero/dashboard"}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
                <Image src="/cropped-favicon.png" alt="Logo" width={32} height={32} />
                <span className="font-bold text-lg text-gray-900">
                    Ultra<span className="text-brand">Group</span> Travel
                </span>
            </Link>

            {/* User Actions Side */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                    {isAgencia ? <Building2 size={18} /> : <User size={18} />}
                    <span className="text-sm font-medium">{user?.name}</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Cerrar sesión</span>
                </button>
            </div>
        </nav>
    );
}
