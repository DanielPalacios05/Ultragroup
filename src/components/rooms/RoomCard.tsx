import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Power, Pencil } from "lucide-react";
import { Room, RoomType } from "@/domain/schemas/hotel.schema";
import { updateRoom } from "@/actions/room.actions";

interface RoomCardProps {
    room: Room;
    roomTypes: RoomType[];
    hotelId: string;
    onUpdate?: () => void;
}

export function RoomCard({ room, roomTypes, hotelId, onUpdate }: RoomCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);

    const handleToggleStatus = async () => {
        try {
            setIsLoading(true);
            // Cycle through statuses for simplicity 'active' -> 'maintenance' -> 'disabled' -> 'active'
            let newStatus: Room['status'] = 'active';
            if (room.status === 'active') newStatus = 'maintenance';
            else if (room.status === 'maintenance') newStatus = 'disabled';
            else newStatus = 'active';

            await updateRoom(room.id, { status: newStatus });
            if (onUpdate) onUpdate();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al cambiar estado");
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusText = () => {
        switch (room.status) {
            case 'active': return 'Activa';
            case 'maintenance': return 'En mantenimiento';
            case 'disabled': return 'Inactiva';
            default: return 'Desconocido';
        }
    };

    const getStatusStyle = () => {
        switch (room.status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'disabled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[300px] transition-all hover:shadow-md relative p-5">

            {/* Title Area */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={() => router.push(`/agencia/dashboard/hoteles/${hotelId}/habitaciones/${room.id}/editar`)}
                    className="p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors focus:outline-none"
                    title="Editar habitación"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                    title="Cambiar estado"
                >
                    <Power size={18} />
                </button>
            </div>

            <div className="mb-4 pr-16 mt-1">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                    {roomType?.name || 'Tipo Desconocido'}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle()}`}>
                    {getStatusText()}
                </span>
            </div>

            <div className="flex-grow flex flex-col justify-between">
                <div className="space-y-1.5 text-sm mb-5">
                    <p className="flex items-start text-gray-600">
                        <MapPin size={16} className="mr-1.5 mt-0.5 text-brand shrink-0" />
                        <span className="line-clamp-2">{room.ubicacion}</span>
                    </p>
                    {roomType?.description && (
                        <p className="text-gray-500 mt-2 text-xs italic line-clamp-2">
                            "{roomType.description}"
                        </p>
                    )}
                </div>

                <div className="mt-auto space-y-1.5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Costo Base</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(room.costoBase)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Impuestos</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(room.impuestos)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                        <span className="font-semibold text-gray-900">Total noche</span>
                        <span className="font-bold text-brand text-lg">{formatCurrency(room.costoBase + room.impuestos)}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
