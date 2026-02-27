import { User } from '@/store/useAuthStore';
import { Reservation } from '@/domain/schemas/reservation.schema';
import { Room } from '@/domain/schemas/hotel.schema';
import { Mail, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRangeDisplay } from '@/components/ui/DateRangeDisplay';

interface ReservationDetailsModalProps {
    reservation: Reservation;
    room: Room;
    traveler: User | null;
    onClose: () => void;
}

export function ReservationDetailsModal({ reservation, room, traveler, onClose }: ReservationDetailsModalProps) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace(/\s/g, '');
    };

    const getStatusText = () => {
        return 'Confirmada';
    };

    const getStatusStyle = () => {
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border-2 border-brand/20 relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Detalles de reserva</h2>
                    <p className="text-sm text-gray-500 mb-3 tracking-wide">id: {reservation.id}</p>
                    <h3 className="text-xl font-bold font-mono text-blue-500 mb-1">{traveler?.name || 'Agencia / Desconocido'}</h3>

                    {traveler && (
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 text-gray-700 font-handwriting text-xl font-bold">
                                <Mail size={18} className="text-brand shrink-0" />
                                {traveler.email ? (
                                    <a href={`mailto:${traveler.email}`} className="hover:text-brand hover:underline">
                                        {traveler.email}
                                    </a>
                                ) : 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 font-handwriting text-xl font-bold">
                                <Phone size={18} className="text-brand shrink-0" />
                                {traveler.phone ? (
                                    <a href={`tel:${traveler.phone}`} className="hover:text-brand hover:underline">
                                        {traveler.phone}
                                    </a>
                                ) : 'N/A'}
                            </div>
                        </div>
                    )}

                    {traveler && (
                        <div className="w-full grid grid-cols-2 gap-y-6 pt-4 border-t border-gray-100 mb-8 text-left">
                            <div>
                                <p className="text-sm text-center text-gray-600 mb-1">Fecha de nacimiento</p>
                                <p className="font-semibold text-center text-gray-900">{traveler.dob || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-center text-gray-600 mb-1">Género</p>
                                <p className="font-semibold text-center text-gray-900">{traveler.gender || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-center text-gray-600 mb-1">Tipo de documento</p>
                                <p className="font-semibold text-center font-handwriting text-xl leading-none text-gray-900">
                                    {traveler.documentType || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-center text-gray-600 mb-1">Numero de documento</p>
                                <p className="font-semibold text-center font-handwriting text-xl leading-none text-gray-900">
                                    {traveler.documentNumber || '-'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-gray-100 gap-4 pt-6">

                        {/* RoomCard styling matching */}
                        <div className="flex w-full md:w-auto items-start bg-white p-2 rounded-xl border border-gray-100">
                            {/* Number Area */}
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
                                <span className="text-xl font-bold text-brand">{room.roomNumber || '??'}</span>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 min-w-0 pr-4 text-left">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-0.5">
                                    {room.location || 'Sin Ubicación'}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">
                                    {room.roomType || 'Sin tipo definido'}
                                </p>

                                <div className="mb-2">
                                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border border-transparent", getStatusStyle())}>
                                        {getStatusText()}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center text-sm">
                                        <span className="text-gray-600 mr-2 w-16">Costo:</span>
                                        <span className="text-gray-900 font-medium">{formatCurrency(room.baseCost)}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="text-gray-600 mr-2 w-16">Impuestos:</span>
                                        <span className="text-gray-900 font-medium">{formatCurrency(room.taxes)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 justify-end self-center pr-2">
                            <DateRangeDisplay
                                startDate={reservation.startDate}
                                endDate={reservation.endDate}
                                className="flex-col gap-y-0 text-right w-full font-handwriting text-xl font-bold bg-white"
                                iconClassName="rotate-90 md:rotate-0"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
