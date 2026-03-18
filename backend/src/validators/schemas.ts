import { z } from 'zod';

export const registroSchema = z.object({
    email: z.string().email({ message: "Email no vÃ¡lido" }),
    password: z.string().min(6, { message: "La contraseÃ±a debe tener al menos 6 caracteres" }),
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    rol: z.enum(['tutor', 'estudiante'], { message: "Rol debe ser 'tutor' o 'estudiante'" })
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Email no vÃ¡lido" }),
    password: z.string().min(1, { message: "La contraseÃ±a es requerida" })
});

export const crearTutorSchema = z.object({
    materias: z.array(z.string()).min(1, { message: "Debe seleccionar al menos una materia" }),
    tarifaHora: z.number().positive({ message: "La tarifa debe ser un nÃºmero positivo" }),
    biografia: z.string().optional(),
});

export const crearDisponibilidadSchema = z.object({
    diaSemana: z.number().int().min(1).max(7),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Fecha debe tener formato YYYY-MM-DD" }),
    horaInicio: z.string().regex(/^\d{2}:\d{2}$/, { message: "Hora de inicio debe tener formato HH:MM" }),
    horaFin: z.string().regex(/^\d{2}:\d{2}$/, { message: "Hora de fin debe tener formato HH:MM" }),
});

export const crearReservaSchema = z.object({
    tutorId: z.string().uuid({ message: "ID de tutor no vÃ¡lido" }),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Fecha debe tener formato YYYY-MM-DD" }),
    horaInicio: z.string().regex(/^\d{2}:\d{2}$/, { message: "Hora de inicio debe tener formato HH:MM" }),
    horaFin: z.string().regex(/^\d{2}:\d{2}$/, { message: "Hora de fin debe tener formato HH:MM" }),
});

export const cancelarReservaSchema = z.object({
    id: z.string().uuid({ message: "ID de reserva no vÃ¡lido" }),
});

export const notificacionIdParamSchema = z.object({
    id: z.coerce.number().int().positive({ message: "ID de notificaciÃ³n no vÃ¡lido" }),
});