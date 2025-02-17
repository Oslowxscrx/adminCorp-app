import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './errors/not-found.component';
import { UsuarioComponent } from './pages/usuarios/usuarios.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
    ],
  },
  {
    path: 'system',
    canActivate: [AuthGuard],
    component: SidebarComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'empleados', component: EmpleadosComponent},
    ]
  },
  { path: '**', component: NotFoundComponent }
];
