import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
    location: string;
    startDate: string;
    endDate: string;
    setLocation: (location: string) => void;
    setDates: (start: string, end: string) => void;
}

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            location: '',
            startDate: '',
            endDate: '',
            setLocation: (location) => set({ location }),
            setDates: (startDate, endDate) => set({ startDate, endDate }),
        }),
        {
            name: 'traveler-search-storage',
        }
    )
);
