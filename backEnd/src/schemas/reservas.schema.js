import { z } from "zod";

export const ReservaCreateSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  telefono: z.string().min(6),
  acepta_novedades: z.boolean().optional().default(false),
  reservation_datetime: z.string(), // ISO, o "YYYY-MM-DDTHH:mm"
  cantidad_personas: z.number().int().min(1).max(12),
});

export const ReservaUpdateSchema = z.object({
  reservation_datetime: z.string().datetime().optional(),
  cantidad_personas: z.number().int().min(1).max(12).optional(),
});

export const StatusSchema = z.object({
  status: z.enum(["pendiente", "confirmada", "cancelada"]),
});