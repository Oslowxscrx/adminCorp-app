import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './errors/not-found.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { UsuarioComponent } from './pages/usuarios/usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { AreaComponent } from './pages/area/area.component';

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
      { path: 'area', component: AreaComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'actividades/:id', component: ActividadesComponent },
      { path: 'usuarios', component: UsuarioComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
