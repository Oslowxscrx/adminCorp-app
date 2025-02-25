import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HomeOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  imports: [
    NzLayoutModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    RouterModule,
  ],
})
export class NotFoundComponent {
  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(HomeOutline);
  }
}
