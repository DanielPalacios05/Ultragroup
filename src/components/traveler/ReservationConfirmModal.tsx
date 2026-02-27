import { User } from '@/store/useAuthStore';
import { Room } from '@/domain/schemas/hotel.schema';
import { Mail, Phone, X } from 'lucide-react';
import { DateRangeDisplay } from '@/components/ui/DateRangeDisplay';

interface ReservationConfirmModalProps {
    room: Room;
    traveler: User | null;
    startDate: string;
    endDate?: string | null;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting?: boolean;
}

export function ReservationConfirmModal({ room, traveler, startDate, endDate, onClose, onConfirm, isSubmitting }: ReservationConfirmModalProps) {
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border-2 border-brand/20 relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmar reserva</h2>

                    <h3 className="text-xl font-bold font-mono text-blue-500 mb-1">{traveler?.name || 'Agencia / Desconocido'}</h3>

                    {traveler && (
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 text-gray-700 font-handwriting text-xl font-bold">
                                <Mail size={18} className="text-brand shrink-0" />
                                <span>{traveler.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 font-handwriting text-xl font-bold">
                                <Phone size={18} className="text-brand shrink-0" />
                                <span>{traveler.phone || 'N/A'}</span>
                            </div>
                        </div>
                    )}

                    {traveler && (
                        <div className="w-full grid grid-cols-2 gap-y-6 pt-4 border-t border-gray-100 mb-8 text-left">
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

                    <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-gray-100 gap-4 pt-6 mb-8">
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
                                <p className="text-sm text-gray-500 truncate">
                                    {room.roomType || 'Sin tipo definido'}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 justify-end self-center pr-2">
                            <DateRangeDisplay
                                startDate={startDate}
                                endDate={endDate}
                                className="flex-col gap-y-0 text-right w-full font-handwriting text-xl font-bold bg-white"
                                iconClassName="rotate-90 md:rotate-0"
                            />
                        </div>
                    </div>

                    <div className="w-full border-t border-gray-100 pt-6 flex flex-col items-center">
                        <p className="text-gray-500 mb-2">Total a pagar en el hotel</p>
                        <p className="font-handwriting text-4xl font-bold text-slate-900 mb-8">{formatCurrency(totalCost)}</p>

                        <button
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="w-full py-3 text-lg font-bold text-white bg-brand hover:bg-brand/90 rounded-full transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin" />
                            ) : (
                                "Confirmar Reserva"
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
