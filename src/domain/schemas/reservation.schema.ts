import * as z from 'zod';

export const reservationSchema = z.object({
    id: z.string(),
    hotelId: z.string(),
    roomId: z.string(),
    userId: z.string(),
    startDate: z.string(), // Format "YYYY-MM-DD" expected from API/Form
    endDate: z.string().optional().nullable(),
});

export type Reservation = z.infer<typeof reservationSchema>;

export type ReservationFormData = Omit<Reservation, 'id'>;
