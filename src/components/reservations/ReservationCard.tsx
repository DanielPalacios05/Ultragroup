import { User } from '@/store/useAuthStore';
import { Reservation } from '@/domain/schemas/reservation.schema';
import { Mail, Phone } from 'lucide-react';
import { DateRangeDisplay } from '@/components/ui/DateRangeDisplay';

interface ReservationCardProps {
    reservation: Reservation;
    roomNumber: string;
    traveler: User | null;
    onClick?: () => void;
}

export function ReservationCard({ reservation, roomNumber, traveler, onClick }: ReservationCardProps) {

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 flex w-full transition-all hover:shadow-md p-4 relative justify-between items-center sm:flex-row flex-col gap-4 ${onClick ? 'cursor-pointer hover:border-brand/50' : ''}`}
        >

            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Number Area */}
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-brand">{roomNumber || '??'}</span>
                </div>

                {/* Traveler Info */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 font-mono tracking-tight text-blue-400">
                        {traveler?.name || 'Viajero Desconocido'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 gap-2 mb-0.5">
                        <Mail size={14} className="text-slate-500" />
                        {traveler?.email ? (
                            <a href={`mailto:${traveler.email}`} className="hover:text-brand hover:underline" onClick={(e) => e.stopPropagation()}>
                                {traveler.email}
                            </a>
                        ) : <span>N/A</span>}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <Phone size={14} className="text-slate-500" />
                        {traveler?.phone ? (
                            <a href={`tel:${traveler.phone}`} className="hover:text-brand hover:underline" onClick={(e) => e.stopPropagation()}>
                                {traveler.phone}
                            </a>
                        ) : <span>N/A</span>}
                    </div>
                </div>
            </div>

            {/* Dates Area like Hand-drawn Mockup */}
            <DateRangeDisplay
                startDate={reservation.startDate}
                endDate={reservation.endDate}
                className="self-center"
            />

        </div>
    );
}
