import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Reserva } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}
  crearReserva(p: { email:string; nombre:string; apellido:string; telefono:string;
    acepta_novedades:boolean; reservation_datetime:string; cantidad_personas:number; notes?:string; }) {
    return this.http.post(`${this.base}/reservas`, p);
  }
  listarPendientes() {
    const params = new HttpParams().set('status','pendiente');
    return this.http.get<{ok:boolean; data:Reserva[]}>(`${this.base}/reservas`, { params });
  }
  cambiarStatus(id:number, status:'pendiente'|'confirmada'|'cancelada') {
    return this.http.patch(`${this.base}/reservas/${id}/status`, { status });
  }
  editarReserva(id:number, body: Partial<Reserva>) {
    return this.http.put(`${this.base}/reservas/${id}`, body);
  }
  eliminarReserva(id:number) {
    return this.http.delete(`${this.base}/reservas/${id}`);
  }
}