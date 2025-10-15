import { Routes } from '@angular/router';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardReservasComponent } from './pages/dashboard-reservas/dashboard-reservas.component';
import { AuthGuard } from './core/guards/auth.guard'; // si ya lo tenés

export const routes: Routes = [
  { path: '', component: ReservaComponent },                  // clientes ven el formulario
  { path: 'login', component: LoginComponent },               // empleados van acá
  { path: 'admin/reservas', component: DashboardReservasComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

