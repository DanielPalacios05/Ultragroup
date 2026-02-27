"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Search } from "lucide-react";
import { HotelCardTraveler } from "@/components/traveler/HotelCardTraveler";
import { searchHotelsByCity } from "@/actions/hotel.actions";
import { Hotel } from "@/domain/schemas/hotel.schema";
import { useSearchStore } from "@/store/useSearchStore";
import { DateRangeSelector } from "@/components/traveler/DateRangeSelector";

export default function ViajeroDashboard() {
    const [mounted, setMounted] = useState(false);

    // Search state
    const { location, setLocation } = useSearchStore();

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const performSearch = useCallback(async () => {
        if (!location.trim()) return;

        setIsSearching(true);
        try {
            const results = await searchHotelsByCity(location.trim());
            setHotels(results);
            setHasSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    }, [location]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (location.trim()) {
                performSearch();
            } else {
                setHotels([]);
                setHasSearched(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [location, performSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch();
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center w-full min-h-[70vh] py-12 px-4 text-black font-sans">

            {/* Animated Hero Title */}
            <div className="text-center mb-10 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                <h1 className="text-5xl md:text-6xl font-handwriting font-bold text-gray-900 tracking-tight">
                    ¿A <span className="text-brand">dónde</span> quieres ir?
                </h1>
            </div>

            {/* Pilled Search Form */}
            <form
                onSubmit={handleSearch}
                className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out fill-mode-both"
            >
                {/* Location Pill */}
                <div className="flex items-center bg-white border-2 border-slate-400 rounded-full px-4 h-14 w-full md:w-1/3 hover:border-brand focus-within:border-brand transition-colors relative shadow-sm">
                    <MapPin className="text-slate-500 shrink-0 mr-3" size={24} />
                    <input
                        type="text"
                        placeholder="Ubicación"
                        className="bg-transparent border-none outline-none w-full text-lg font-handwriting placeholder:text-slate-400 font-bold text-slate-800"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required={false}
                    />
                </div>

                <DateRangeSelector />

                {/* Search Submit Button */}
                <button
                    type="submit"
                    disabled={isSearching}
                    className="h-14 w-14 md:w-auto md:px-8 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand/90 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                >
                    {isSearching ? (
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    ) : (
                        <span className="font-bold hidden md:inline-block">Buscar</span>
                    )}
                    <Search className="md:hidden" size={24} />
                </button>
            </form>

            {/* Results Section */}
            {hasSearched && (
                <div className="w-full max-w-6xl animate-in fade-in duration-500">
                    {hotels.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron hoteles</h3>
                            <p className="text-gray-500">Intenta buscar con otra ciudad o ubicación.</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Hoteles disponibles en <span className="text-brand capitalize">{location}</span>
                            </h3>
                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                {hotels.map(hotel => (
                                    <HotelCardTraveler
                                        key={hotel.id}
                                        hotel={hotel}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
