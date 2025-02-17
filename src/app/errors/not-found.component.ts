import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { RouterModule } from '@angular/router';
import { HomeOutline} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  imports:[
    NzLayoutModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    RouterModule
  ]
})
export class NotFoundComponent {
  constructor(
    private iconService: NzIconService,
  ){
        this.iconService.addIcon(
          HomeOutline
        );
  }
}
