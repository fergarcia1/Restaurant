export interface Cliente {
  id?: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  acepta_novedades: boolean;
}