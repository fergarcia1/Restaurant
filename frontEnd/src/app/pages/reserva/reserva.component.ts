import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReservasService } from '../../core/services/reservas.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ReservaComponent {
  msg = '';
  form!: FormGroup;

  constructor(private fb: FormBuilder, private api: ReservasService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      acepta_novedades: [false],
      reservation_datetime: ['', [Validators.required]],
      cantidad_personas: [2, [Validators.required, Validators.min(1), Validators.max(12)]],
    });
  }
  submit() {
    if (this.form.invalid) { this.msg = 'Revisá los campos.'; return; }

    const v = this.form.getRawValue() as any;
    // datetime-local -> MySQL DATETIME (YYYY-MM-DD HH:mm:ss)
    const dt = new Date(v.reservation_datetime);
    const reservation_datetime = isNaN(+dt)
      ? v.reservation_datetime
      : dt.toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      email: v.email,
      nombre: v.nombre,
      apellido: v.apellido,
      telefono: v.telefono,
      acepta_novedades: !!v.acepta_novedades,
      cantidad_personas: Number(v.cantidad_personas),
      reservation_datetime
    };

    console.log(payload);
    

    this.api.crearReserva(payload).subscribe({
      next: () => {
        this.msg = 'Reserva enviada.';
        this.form.reset({ cantidad_personas: 2, acepta_novedades: false });
      },
      error: (e) => {
        const z = e?.error?.error; // objeto del flatten de Zod
        const first =
          (z?.fieldErrors && Object.values(z.fieldErrors).flat()[0]) ||
          e?.error?.message ||
          `Error ${e.status || ''} creando la reserva`;
        this.msg = first;
        console.error('POST /api/reservas error:', e);
      }
    });
  }
}