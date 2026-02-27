import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Check, Power, Pencil } from "lucide-react";
import { Room } from "@/domain/schemas/hotel.schema";
import { updateRoom } from "@/actions/room.actions";
import { cn } from "@/components/ui/RoleSwitcher";

interface RoomCardProps {
    room: Room;
    hotelId: string;
    index: number;
    onUpdate?: () => void;
}

export function RoomCard({ room, hotelId, index, onUpdate }: RoomCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Use room.roomNumber if available, fallback gracefully to formatted index
    const displayId = room.roomNumber || index.toString().padStart(2, '0');

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleClick = () => {
        setIsMenuOpen(false);
        if (room.status === 'disabled') {
            executeToggle();
        } else {
            setShowModal(true);
        }
    };

    const executeToggle = async () => {
        try {
            setIsLoading(true);
            // Toggle only between 'available' and 'disabled', ignoring 'reserved' cycling
            let newStatus: Room['status'] = 'available';
            if (room.status === 'available' || room.status === 'reserved') newStatus = 'disabled';
            else newStatus = 'available';

            await updateRoom(room.id, { status: newStatus });
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

    const handleEdit = () => {
        setIsMenuOpen(false);
        router.push(`/agencia/dashboard/hoteles/${hotelId}/habitaciones/${room.id}/editar`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace(/\s/g, ''); // Ensure no spaces between symbol and number if desired
    };

    const getStatusText = () => {
        switch (room.status) {
            case 'available': return 'Disponible';
            case 'reserved': return 'Reservada';
            case 'disabled': return 'Inhabilitada';
            default: return 'Desconocido';
        }
    };

    const getStatusStyle = () => {
        switch (room.status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'reserved': return 'bg-blue-100 text-blue-800';
            case 'disabled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[250px] transition-all hover:shadow-md p-4 relative">

            {/* Modal de confirmación para inhabilitar */}
            {showModal && (
                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]">
                    <div className="bg-white p-5 rounded-lg shadow-xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">¿Inhabilitar Habitación?</h4>
                        <p className="text-sm text-gray-600 mb-5">
                            Esta habitación no podrá ser elegida para nuevas reservas.
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
                                Inhabilitar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Number Area */}
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
                <span className="text-xl font-bold text-brand">{displayId}</span>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 pr-8">

                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-0.5">
                    {room.location || 'Sin Ubicación'}
                </h3>
                <p className="text-sm text-gray-500 mb-2 truncate">
                    {room.roomType || 'Sin tipo definido'}
                </p>

                <div className="mb-4">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border border-transparent", getStatusStyle())}>
                        {getStatusText()}
                    </span>
                </div>

                <div className="space-y-1 mt-auto">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 mr-2 w-20">Costo:</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(room.baseCost)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 mr-2 w-20">Impuestos:</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(room.taxes)}</span>
                    </div>
                </div>

            </div>

            {/* 3 Dots Menu Button */}
            <div className="absolute top-4 right-2" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded-full transition-colors focus:outline-none"
                    title="Opciones"
                >
                    <MoreVertical size={20} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10">
                        <button
                            onClick={handleEdit}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                        >
                            <Pencil size={16} className="text-gray-600" /> Editar
                        </button>
                        <button
                            onClick={handleToggleClick}
                            disabled={isLoading}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 font-medium disabled:opacity-50 ${room.status === 'disabled'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-red-600 hover:bg-red-50'
                                }`}
                        >
                            {room.status === 'disabled' ? (
                                <>
                                    <Check size={16} /> Habilitar
                                </>
                            ) : (
                                <>
                                    <Power size={16} /> Inhabilitar
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
