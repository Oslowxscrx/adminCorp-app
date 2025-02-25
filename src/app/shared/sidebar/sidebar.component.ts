import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AuthService } from '../../service/auth.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import {
  AppstoreOutline,
  MenuFoldOutline,
  ProjectOutline,
  UserAddOutline,
  UsergroupAddOutline,
  UserOutline,
  DashboardOutline,
  AreaChartOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDividerModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzButtonModule,
  ]
})
export class SidebarComponent {
  isCollapsed = false;
  isLogoutExpanded = false;
  constructor(
    private iconService: NzIconService,
    private authService: AuthService
  ) {
    this.iconService.addIcon(
      MenuFoldOutline,
      ProjectOutline,
      UsergroupAddOutline,
      AppstoreOutline,
      UserAddOutline,
      UserOutline,
      DashboardOutline,
      AreaChartOutline
    );
  }
  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Llama al servicio para cerrar sesión
    // Redirige a la página de login o cualquier otra página que desees
    window.location.reload(); // Recarga la página
    
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleLogout(): void {
    this.isLogoutExpanded = !this.isLogoutExpanded;
  }
}
