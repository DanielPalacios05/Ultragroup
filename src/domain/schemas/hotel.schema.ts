import * as z from 'zod';

export const hotelSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'El nombre es requerido'),
    city: z.string().min(1, 'La ciudad es requerida'),
    searchCity: z.string(),
    address: z.string().min(1, 'La dirección es requerida'),
    roomsAmount: z.number().min(0),
    roomsAvailable: z.number().min(0),
    status: z.enum(['enabled', 'disabled']),
});

export type Hotel = z.infer<typeof hotelSchema>;

export const roomSchema = z.object({
    id: z.string(),
    hotelId: z.string(),
    roomTypeId: z.string(),
    costoBase: z.number().min(0),
    impuestos: z.number().min(0),
    ubicacion: z.string(),
    status: z.enum(['active', 'maintenance', 'disabled']),
});

export type Room = z.infer<typeof roomSchema>;

export const roomTypeSchema = z.object({
    id: z.string(),
    hotelId: z.string(),
    name: z.string(),
    description: z.string(),
});

export type RoomType = z.infer<typeof roomTypeSchema>;
