"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export default function ViajeroDashboard() {
    const user = useAuthStore(state => state.user);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="animate-in fade-in duration-500 text-black">
            <h1 className="text-3xl font-bold mb-4">Bienvenido, {user?.email}</h1>
            <p className="text-gray-600">Este es tu panel de viajero. (En construcción)</p>
        </div>
    )
}
