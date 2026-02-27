import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building, MoreVertical } from "lucide-react";
import { Hotel } from "@/domain/schemas/hotel.schema";
import { toggleHotelStatus } from "@/actions/hotel.actions";

interface HotelCardProps {
    hotel: Hotel;
    onUpdate?: () => void;
}

export function HotelCard({ hotel, onUpdate }: HotelCardProps) {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const executeToggle = async () => {
        try {
            setIsLoading(true);
            await toggleHotelStatus(hotel.id, hotel.status);
            setShowModal(false);
            if (onUpdate) onUpdate();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al cambiar estado");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleClick = () => {
        if (hotel.status === 'enabled') {
            setShowModal(true);
        } else {
            // Un-pausing can just happen directly, or you can require confirmation
            executeToggle();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[300px] transition-all hover:shadow-md relative p-5">

            {/* Modal de confirmación para desactivar */}
            {showModal && (
                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]">
                    <div className="bg-white p-5 rounded-lg shadow-xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">¿Desactivar Hotel?</h4>
                        <p className="text-sm text-gray-600 mb-5">
                            Los viajeros no podrán realizar más reservas en este hotel.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeToggle}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex flex-row items-center gap-2"
                            >
                                {isLoading && <div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent animate-spin" />}
                                Desactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 3-dots Menu */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                    aria-label="Opciones"
                >
                    <MoreVertical size={20} />
                </button>

                {/* Action Dropdown */}
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1">
                        <button
                            onClick={() => router.push(`/agencia/dashboard/hoteles/${hotel.id}/editar`)}
                            className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => {
                                handleToggleClick();
                                setMenuOpen(false);
                            }}
                            className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                            {hotel.status === 'enabled' ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                )}
            </div>

            {/* Header / Title Area */}
            <div className="flex items-start gap-4 mb-4 mt-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 pr-14">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{hotel.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${hotel.status === 'enabled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {hotel.status === 'enabled' ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow flex flex-col justify-between">
                {/* Location Info */}
                <div className="space-y-1.5 text-sm mb-5">
                    <p className="flex items-start text-gray-600">
                        <MapPin size={16} className="mr-1.5 mt-0.5 text-brand shrink-0" />
                        <span className="line-clamp-1">{hotel.city}</span>
                    </p>
                    <p className="flex items-start text-gray-600">
                        <MapPin size={16} className="mr-1.5 mt-0.5 text-brand shrink-0" />
                        <span className="line-clamp-2">{hotel.address}</span>
                    </p>
                </div>

                {/* Rooms Info Footer */}
                <div className="mt-auto space-y-1.5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Total habitaciones</span>
                        <span className="font-bold text-gray-900">{hotel.roomsAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <span>Disponibles</span>
                        <span className="font-bold text-brand">{hotel.roomsAvailable}</span>
                    </div>

                    <button
                        onClick={() => router.push(`/agencia/dashboard/hoteles/${hotel.id}/habitaciones`)}
                        className="w-full bg-brand text-white py-2 rounded-md font-medium text-sm hover:bg-black transition-colors"
                    >
                        Ver Habitaciones
                    </button>
                </div>
            </div>
        </div>
    );
}
