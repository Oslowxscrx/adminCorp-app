import { Routes } from '@angular/router';
import { EmpleadosComponent } from './pages/empleados/empleados.component';

export const routes: Routes = [
  {path: '', redirectTo: '/empleados', pathMatch: 'full'},
  {path: 'empleados', component: EmpleadosComponent}
];
