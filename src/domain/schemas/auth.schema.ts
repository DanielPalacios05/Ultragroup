import * as z from 'zod';

export const registroSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    dob: z.string().refine((dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        // Verify it's a valid date and in the past
        return !isNaN(date.getTime()) && date < now;
    }, { message: 'Debe ser una fecha válida en el pasado' }),
    gender: z.string().min(1, 'Selecciona un género'),
    documentType: z.enum(['CC', 'TI', 'PASAPORTE', 'CE'], {
        message: 'Tipo de documento inválido o requerido'
    }),
    documentNumber: z.string().min(5, 'El número de documento debe tener al menos 5 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    phone: z.string().min(7, 'El teléfono debe tener al menos 7 números'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type RegistroFormValues = z.infer<typeof registroSchema>;

export const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
