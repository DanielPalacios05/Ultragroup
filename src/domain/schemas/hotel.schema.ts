import * as z from 'zod';

export const hotelSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'El nombre es requerido'),
    city: z.string().min(1, 'La ciudad es requerida'),
    address: z.string().min(1, 'La dirección es requerida'),
    status: z.enum(['enabled', 'disabled']),
});

export type Hotel = z.infer<typeof hotelSchema>;

export const hotelFormSchema = hotelSchema.omit({
    id: true
});

export type HotelFormData = z.infer<typeof hotelFormSchema>;
export const roomSchema = z.object({
    id: z.string(),
    hotelId: z.string(),
    roomNumber: z.string().max(3, 'El número no puede tener más de 3 caracteres').min(1, 'Requerido'),
    roomType: z.string().min(1, 'El tipo de habitación es requerido'),
    baseCost: z.number().min(0, 'El costo no puede ser negativo'),
    taxes: z.number().min(0, 'Los impuestos no pueden ser negativos'),
    location: z.string().min(1, 'La ubicación es requerida'),
    status: z.enum(['available', 'reserved', 'disabled']),
});

export type Room = z.infer<typeof roomSchema>;

export const roomFormSchema = roomSchema.omit({
    id: true,
});

export type RoomFormData = z.infer<typeof roomFormSchema>;
