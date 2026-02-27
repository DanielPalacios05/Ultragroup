import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeDisplayProps {
    startDate: string;
    endDate?: string | null;
    className?: string;
    iconClassName?: string;
}

export function DateRangeDisplay({ startDate, endDate, className, iconClassName }: DateRangeDisplayProps) {
    const hasEndDate = endDate && endDate.trim() !== '';

    return (
        <div className={cn("flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-handwriting text-xl font-bold text-slate-800", className)}>
            <span>{startDate || '-'}</span>
            {hasEndDate && (
                <>
                    <ArrowRight size={20} className={cn("text-brand shrink-0", iconClassName)} />
                    <span>{endDate}</span>
                </>
            )}
        </div>
    );
}
