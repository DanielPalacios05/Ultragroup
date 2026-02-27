import { Hotel } from "@/domain/schemas/hotel.schema";
import { Building, MapPin } from "lucide-react";
import Link from "next/link";

interface HotelCardTravelerProps {
    hotel: Hotel;
}

export function HotelCardTraveler({ hotel }: HotelCardTravelerProps) {
    const href = `/viajero/dashboard/hoteles/${hotel.id}/habitaciones`;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full min-w-[300px] max-w-sm transition-all hover:shadow-md relative p-5">

            {/* Header / Title Area */}
            <div className="flex items-start gap-4 mb-4 mt-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 pr-14">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{hotel.name}</h3>
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
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <Link
                    href={href}
                    className="w-full block text-center px-4 py-2 text-sm font-semibold text-white bg-brand rounded-md hover:bg-brand/90 transition-colors"
                >
                    Ver habitaciones
                </Link>
            </div>

        </div>
    );
}
