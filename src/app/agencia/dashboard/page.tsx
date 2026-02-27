"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { HotelCard } from '@/components/hotels/HotelCard';
import { Hotel } from '@/domain/schemas/hotel.schema';
import { getHoteles } from '@/actions/hotel.actions';

export default function AgenciaDashboard() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshCount, setRefreshCount] = useState(0);

    // Debounced fetch
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                setError(null);
                // Add a slight delay to allow typing
                const { data, totalCount: total } = await getHoteles(search);
                setHotels(data);
                setTotalCount(total);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar hoteles');
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchHotels();
        }, 400);

        return () => clearTimeout(debounceTimer);
    }, [search, refreshCount]);

    return (
        <div className="w-full flex-col flex animate-in fade-in duration-500 text-black">
            {/* Header section as shown in sketch */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-brand  font-mono tracking-tight text-blue-400">
                    Hoteles
                </h1>
                <Link
                    href="/agencia/dashboard/hoteles/nuevo"
                    className="bg-brand text-white px-4 py-2 rounded-md font-medium hover:bg-black transition-colors"
                >
                    + Nuevo Hotel
                </Link>
            </div>

            {/* Styled Searchbar */}
            <div className="mb-8 max-w-lg relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Nombre o ciudad"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-brand sm:text-lg font-medium shadow-sm"
                />
            </div>

            {loading && (
                <div className="w-full flex justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && hotels.length === 0 && (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-lg">No se encontraron hoteles con esa búsqueda.</p>
                </div>
            )}

            {/* Grid of Hotels */}
            {!loading && !error && hotels.length > 0 && (
                <div className="flex flex-row flex-wrap gap-6 mt-4">
                    {hotels.map((hotel) => (
                        <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onUpdate={() => setRefreshCount(c => c + 1)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
