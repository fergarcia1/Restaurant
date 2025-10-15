import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReservasService } from '../../core/services/reservas.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent {
  // ✅ props (una sola vez)
  msg: string = '';
  msgType: 'success' | 'error' | '' = '';
  loading = false;
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
    if (this.form.invalid) { this.msg = 'Revisá los campos.'; this.msgType = 'error'; return; }
    this.loading = true;

    const v = this.form.getRawValue() as any;
    const dt = new Date(v.reservation_datetime);
    const reservation_datetime = isNaN(+dt)
      ? v.reservation_datetime
      : dt.toISOString().slice(0,19).replace('T',' ');

    const payload = {
      email: v.email,
      nombre: v.nombre,
      apellido: v.apellido,
      telefono: v.telefono,
      acepta_novedades: !!v.acepta_novedades,
      cantidad_personas: Number(v.cantidad_personas),
      reservation_datetime
    };

    this.api.crearReserva(payload).subscribe({
      next: () => {
        this.msg = '✅ ¡Reserva creada con éxito! Te contactaremos para confirmar.';
        this.msgType = 'success';
        this.form.reset({ cantidad_personas: 2, acepta_novedades: false });
        setTimeout(() => { this.msg = ''; this.msgType = ''; }, 4000);
      },
      error: (e) => {
        const z = e?.error?.error;
        const first =
          (z?.fieldErrors && (Object.values(z.fieldErrors).flat()[0] as string)) ||
          e?.error?.message || `Error ${e.status || ''} creando la reserva`;
        this.msg = `❌ ${first}`;
        this.msgType = 'error';
        console.error('POST /api/reservas error:', e);
      },
      complete: () => this.loading = false
    });
  }
}