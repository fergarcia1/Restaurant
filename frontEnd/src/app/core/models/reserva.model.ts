export interface Reserva {
  id?: number;
  cliente_id?: number;
  reservation_datetime: string;
  cantidad_personas: number;
  status?: 'pendiente'|'confirmada'|'cancelada';
  nombre?: string; apellido?: string; email?: string; telefono?: string;
}