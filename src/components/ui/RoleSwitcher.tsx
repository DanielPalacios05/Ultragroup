import React from 'react';
import { User, Building2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type Role = 'viajero' | 'agencia';

interface RoleSwitcherProps {
    role: Role;
    onChange: (role: Role) => void;
}

export function RoleSwitcher({ role, onChange }: RoleSwitcherProps) {
    return (
        <div className="relative flex w-full max-w-sm items-center rounded-full bg-blue-100 p-1">
            {/* Animated pill background */}
            <div
                className={cn(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
                    role === 'agencia' ? "translate-x-full" : "translate-x-0"
                )}
            />

            {/* Options */}
            <button
                type="button"
                onClick={() => onChange('viajero')}
                className={cn(
                    "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors",
                    role === 'viajero' ? "text-brand" : "text-gray-500 hover:text-gray-700"
                )}
            >
                <User className="h-4 w-4" />
                Eres viajero
            </button>

            <button
                type="button"
                onClick={() => onChange('agencia')}
                className={cn(
                    "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors",
                    role === 'agencia' ? "text-brand" : "text-gray-500 hover:text-gray-700"
                )}
            >
                <Building2 className="h-4 w-4" />
                Eres agencia
            </button>
        </div>
    );
}
