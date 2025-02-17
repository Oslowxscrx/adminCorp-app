import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Router, RouterModule } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider'; 
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
  DashboardOutline
} from '@ant-design/icons-angular/icons';
import { AuthService } from '../../service/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
  ],
})
export class SidebarComponent{
  isCollapsed = false;
  constructor(
    private iconService: NzIconService, 
    private router: Router,
    private authService: AuthService
  ) 
  {
    this.iconService.addIcon(
      MenuFoldOutline,
      ProjectOutline,
      UsergroupAddOutline,
      AppstoreOutline,
      UserAddOutline, 
      UserOutline,
      DashboardOutline
    );
  }
  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();  // Llama al servicio para cerrar sesión
    // Redirige a la página de login o cualquier otra página que desees
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
