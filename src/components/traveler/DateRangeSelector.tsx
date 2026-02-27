import { Calendar } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

interface DateRangeSelectorProps {
    className?: string;
}

export function DateRangeSelector({ className = '' }: DateRangeSelectorProps) {
    const { startDate, endDate, setDates } = useSearchStore();

    return (
        <div className={`flex items-center bg-white border-2 border-slate-400 rounded-full px-4 h-14 w-full hover:border-brand focus-within:border-brand transition-colors shadow-sm divide-x-2 divide-slate-200 ${className}`}>
            <div className="flex items-center w-1/2 pr-3 group">
                <Calendar className="text-slate-500 shrink-0 mr-2 group-focus-within:text-brand" size={20} />
                <div className="flex flex-col w-full relative">
                    <span className="text-[10px] uppercase font-bold text-slate-400 absolute -top-1">Llegada</span>
                    <input
                        type="date"
                        className="bg-transparent font-bold font-handwriting border-none outline-none w-full text-sm mt-3 text-slate-700"
                        value={startDate}
                        onChange={(e) => setDates(e.target.value, endDate)}
                    />
                </div>
            </div>

            <div className="flex items-center w-1/2 pl-3 group">
                <Calendar className="text-slate-500 shrink-0 mr-2 group-focus-within:text-brand" size={20} />
                <div className="flex flex-col w-full relative">
                    <span className="text-[10px] uppercase font-bold text-slate-400 absolute -top-1">Salida</span>
                    <input
                        type="date"
                        className="bg-transparent font-bold font-handwriting border-none outline-none w-full text-sm mt-3 text-slate-700"
                        value={endDate}
                        onChange={(e) => setDates(startDate, e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
