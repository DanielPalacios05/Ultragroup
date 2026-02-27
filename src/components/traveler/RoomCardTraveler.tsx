import { Room } from "@/domain/schemas/hotel.schema";

interface RoomCardTravelerProps {
    room: Room;
    onReserveClick: (room: Room) => void;
}

export function RoomCardTraveler({ room, onReserveClick }: RoomCardTravelerProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace(/\s/g, '');
    };

    const totalCost = room.baseCost + room.taxes;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full min-w-[250px] max-w-sm transition-all hover:shadow-md p-5 relative">
            <div className="flex w-full items-start mb-4">
                {/* Number Area */}
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
                    <span className="text-xl font-bold text-brand">{room.roomNumber || '??'}</span>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-0.5">
                        {room.location || 'Sin Ubicación'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">
                        {room.roomType || 'Sin tipo definido'}
                    </p>

                    <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm leading-none">
                            Disponible
                        </span>
                    </div>
                </div>
            </div>

            {/* Total Cost Display */}
            <div className="flex justify-center items-center py-4 mb-4 font-handwriting text-3xl font-bold text-slate-900 border-y border-dashed border-gray-200">
                {formatCurrency(totalCost)}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
                <button
                    onClick={() => onReserveClick(room)}
                    className="w-full text-center px-4 py-2.5 text-lg font-semibold text-white bg-brand rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                >
                    Reservar habitación
                </button>
            </div>
        </div>
    );
}
