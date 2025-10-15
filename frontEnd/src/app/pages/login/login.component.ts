import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginComponent {
  msg = '';
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['admin@resto.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit() {
  if (this.form.invalid) return;
  const { email, password } = this.form.getRawValue() as any;

  this.auth.login(email, password).subscribe({
    next: r => {
      this.auth.setToken(r.token);              // guarda JWT
      this.router.navigate(['/admin/reservas']); // redirige al dashboard
    },
    error: () => this.msg = 'Credenciales inválidas'
  });
}
}