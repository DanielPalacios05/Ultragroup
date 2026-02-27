"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { HotelForm } from '@/components/hotels/HotelForm';
import { getHotelById, updateHotel } from '@/actions/hotel.actions';
import { getRooms } from '@/actions/room.actions';
import { Hotel, HotelFormData, Room } from '@/domain/schemas/hotel.schema';
import { RoomCard } from '@/components/rooms/RoomCard';
import Link from 'next/link';
import { ChevronLeft, Search } from 'lucide-react';
import { getReservationsByHotel } from '@/actions/reservation.actions';
import { Reservation } from '@/domain/schemas/reservation.schema';
import { ReservationCard } from '@/components/reservations/ReservationCard';
import { ReservationDetailsModal } from '@/components/reservations/ReservationDetailsModal';
import { getUserById } from '@/actions/auth.actions';
import { User } from '@/store/useAuthStore';


export default function EditarHotelPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const [initialData, setInitialData] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [refreshRooms, setRefreshRooms] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [activeTab, setActiveTab] = useState<'habitaciones' | 'reservas'>('habitaciones');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [travelers, setTravelers] = useState<Record<string, User>>({});
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [hotelData, roomsData, reservationsData] = await Promise.all([
                    getHotelById(id),
                    getRooms(id, statusFilter),
                    getReservationsByHotel(id)
                ]);

                setInitialData(hotelData);
                setRooms(roomsData);
                setReservations(reservationsData);

                // Pre-fetch all unique travelers for the reservations
                const uniqueUserIds = [...new Set(reservationsData.map(r => r.userId))];
                const usersData = await Promise.all(
                    uniqueUserIds.map(uid => getUserById(uid))
                );

                const travelersMap: Record<string, User> = {};
                usersData.forEach(u => {
                    if (u) travelersMap[u.id] = u;
                });
                setTravelers(travelersMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error cargando datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, statusFilter, refreshRooms]);

    const handleUpdate = async (data: HotelFormData) => {
        if (!initialData) return;
        await updateHotel(id, { ...initialData, ...data });
    };

    if (loading && !initialData) {
        return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;
    }

    if (error && !initialData) {
        return (
            <div className="max-w-3xl mx-auto w-full flex-col flex animate-in fade-in text-black">
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error || 'Hotel no encontrado'}</div>
                <button onClick={() => router.back()} className="text-brand underline">Volver</button>
            </div>
        );
    }

    const filteredRooms = rooms.filter(r => !searchQuery || (r.roomNumber || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredReservations = reservations.filter(res => {
        if (!searchQuery) return true;
        const matchedRoom = rooms.find(r => r.id === res.roomId);
        return (matchedRoom?.roomNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="max-w-4xl mx-auto w-full flex-col flex animate-in fade-in duration-500 text-black space-y-12">

            {/* HOTEL EDIT SECTION */}
            <section>
                <div className="mb-6">
                    <Link
                        href="/agencia/dashboard"
                        className="text-brand flex items-center gap-1 text-sm font-medium mb-4 hover:underline"
                    >
                        <ChevronLeft size={16} /> Regresar a Hoteles
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight text-blue-400">
                        Editar Hotel
                    </h1>
                </div>

                {initialData && (
                    <HotelForm
                        initialData={initialData}
                        onSubmitAction={handleUpdate}
                        submitLabel="Actualizar Hotel"
                    />
                )}
            </section>

            {/* TABS SECTION */}
            <div className="flex border-b border-gray-200 mt-2 mb-8">
                <button
                    onClick={() => setActiveTab('habitaciones')}
                    className={`pb-4 px-6 font-medium text-lg focus:outline-none transition-colors ${activeTab === 'habitaciones'
                        ? 'text-brand border-b-2 border-brand font-bold'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Habitaciones
                </button>
                <button
                    onClick={() => setActiveTab('reservas')}
                    className={`pb-4 px-6 font-medium text-lg focus:outline-none transition-colors ${activeTab === 'reservas'
                        ? 'text-brand border-b-2 border-brand font-bold'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Reservas
                </button>
            </div>

            {/* ROOMS MANAGEMENT SECTION */}
            {activeTab === 'habitaciones' && (
                <section className="animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-brand">Habitaciones</h2>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar número..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand font-medium"
                            >
                                <option value="all">Todos</option>
                                <option value="available">Disponible</option>
                                <option value="reserved">Reservada</option>
                                <option value="disabled">Inhabilitada</option>
                            </select>
                        </div>

                        <Link
                            href={`/agencia/dashboard/hoteles/${id}/habitaciones/nueva`}
                            className="bg-white border-2 border-brand text-brand px-4 py-1.5 rounded-md font-semibold hover:bg-brand hover:text-white transition-colors"
                        >
                            + Añadir habitaciones
                        </Link>
                    </div>

                    {loading && initialData && (
                        <div className="w-full flex justify-center p-6">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
                        </div>
                    )}

                    {!loading && filteredRooms.length === 0 && (
                        <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No hay habitaciones registradas o que coincidan con la búsqueda.</p>
                        </div>
                    )}

                    {!loading && filteredRooms.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-4">
                            {filteredRooms.map((room, index) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    hotelId={id}
                                    index={index + 1}
                                    onUpdate={() => setRefreshRooms(c => c + 1)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* RESERVATIONS MANAGEMENT SECTION */}
            {activeTab === 'reservas' && (
                <section className="animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-brand">Lista de Reservas</h2>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por habitación..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm"
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="w-full flex justify-center p-6">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
                        </div>
                    )}

                    {!loading && filteredReservations.length === 0 && (
                        <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No hay reservas registradas vinculadas a este hotel con esa búsqueda.</p>
                        </div>
                    )}

                    {!loading && filteredReservations.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {filteredReservations.map(res => {
                                const matchedRoom = rooms.find(r => r.id === res.roomId);
                                const traveler = travelers[res.userId] || null;
                                return (
                                    <ReservationCard
                                        key={res.id}
                                        reservation={res}
                                        roomNumber={matchedRoom?.roomNumber || '??'}
                                        traveler={traveler}
                                        onClick={() => setSelectedReservation(res)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* MODAL OVERLAY */}
            {selectedReservation && (
                <ReservationDetailsModal
                    reservation={selectedReservation}
                    room={rooms.find(r => r.id === selectedReservation.roomId)!}
                    traveler={travelers[selectedReservation.userId] || null}
                    onClose={() => setSelectedReservation(null)}
                />
            )}

        </div>
    );
}
