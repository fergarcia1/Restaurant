import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasService } from '../../core/services/reservas.service';
import { Reserva } from '../../core/models/reserva.model';

@Component({
  selector: 'app-dashboard-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-reservas.component.html',
  styleUrls: ['./dashboard-reservas.component.css']
})
export class DashboardReservasComponent implements OnInit {
  reservas: Reserva[] = []; msg='';
  constructor(private api: ReservasService) {}
  ngOnInit(){ this.cargar(); }
  cargar(){
    this.api.listarPendientes().subscribe({
      next: r => this.reservas = r.data,
      error: e => this.msg = e?.error?.error || 'Error listando reservas'
    });
  }
  confirmar(id:number){ this.api.cambiarStatus(id,'confirmada').subscribe({ next:()=>this.cargar() }); }
  cancelar(id:number){ this.api.cambiarStatus(id,'cancelada').subscribe({ next:()=>this.cargar() }); }
  eliminar(id:number){ this.api.eliminarReserva(id).subscribe({ next:()=>this.cargar() }); }
}