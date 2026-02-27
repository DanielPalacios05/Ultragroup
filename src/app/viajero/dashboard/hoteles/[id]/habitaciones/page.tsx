"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { ArrowLeft, Building, MapPin } from "lucide-react";
import { Hotel } from "@/domain/schemas/hotel.schema";
import { Room } from "@/domain/schemas/hotel.schema";
import { getHotelById } from "@/actions/hotel.actions";
import { getRoomsByHotel } from "@/actions/room.actions";
import { createReservation } from "@/actions/reservation.actions";
import { DateRangeSelector } from "@/components/traveler/DateRangeSelector";
import { RoomCardTraveler } from "@/components/traveler/RoomCardTraveler";
import { ReservationConfirmModal } from "@/components/traveler/ReservationConfirmModal";

export default function HabitacionesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const { startDate, endDate } = useSearchStore();

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hotelData, roomsData] = await Promise.all([
                    getHotelById(id),
                    getRoomsByHotel(id, 'available')
                ]);
                setHotel(hotelData);
                setRooms(roomsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleReserveConfirm = async () => {
        if (!selectedRoom || !user) return;

        setIsSubmitting(true);
        try {
            await createReservation({
                hotelId: id,
                roomId: selectedRoom.id,
                userId: user.id,
                startDate: startDate,
                endDate: endDate || undefined,
            });

            setSelectedRoom(null);
            router.push('/viajero/dashboard');

        } catch (error) {
            console.error("Failed to create reservation:", error);
            alert("No se pudo confirmar la reserva. Intente de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !hotel) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto py-8 px-4 text-black font-sans">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-brand font-medium mb-8 w-fit transition-colors"
            >
                <ArrowLeft size={20} />
                Regresar a inicio
            </button>

            {/* Split Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Hotel Info Side */}
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Building className="w-7 h-7 text-gray-700" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-handwriting font-bold text-gray-900 leading-tight mb-2">
                            {hotel.name}
                        </h1>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={16} className="text-brand mr-1.5" />
                            <span>{hotel.city} - {hotel.address}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-white border-2 border-slate-300 rounded-2xl shadow-sm min-w-[320px] justify-center">
                    <DateRangeSelector />
                </div>
            </div>

            {/* Available Rooms Section */}
            <h2 className="text-2xl font-bold text-brand mb-6 animate-in fade-in duration-500 delay-150">
                Habitaciones disponibles
            </h2>

            {rooms.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No hay habitaciones disponibles en este momento.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    {rooms.map(room => (
                        <RoomCardTraveler
                            key={room.id}
                            room={room}
                            onReserveClick={setSelectedRoom}
                        />
                    ))}
                </div>
            )}

            {/* Reservation Modal Wrapper */}
            {selectedRoom && (
                <ReservationConfirmModal
                    room={selectedRoom}
                    traveler={user}
                    startDate={startDate}
                    endDate={endDate}
                    onClose={() => setSelectedRoom(null)}
                    onConfirm={handleReserveConfirm}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
