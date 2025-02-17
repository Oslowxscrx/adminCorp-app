import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, SidebarComponent, NzLayoutModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adminCorpApp';
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.includes('/auth/login');
      }
    });
  }
}
