import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proyecto } from '../../../interface/proyectos/proyectos';
import { ProyectosService } from '../../../service/proyectos.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconService, NzIconModule } from 'ng-zorro-antd/icon';
import {
  MinusOutline,
  PlusOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-progress-modal',
  templateUrl: './modal-estado.component.html',
  styleUrls: ['./modal-estado.component.css'],
  imports: [NzProgressModule, NzButtonModule, NzIconModule],
})
export class ProgressModalComponent {
  proyecto: Proyecto;
  percent: number;

  constructor(
    public dialogRef: MatDialogRef<ProgressModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { proyecto: Proyecto },
    private _proyectoService: ProyectosService,
    private iconService: NzIconService,
  ) {
    this.proyecto = data.proyecto;
    this.percent = parseInt(this.proyecto.estado);
    this.iconService.addIcon(
      MinusOutline,
      PlusOutline,
    );
  }

  increase(): void {
    this.percent = Math.min(this.percent + 10, 100);
    this.updateEstado();
  }

  decline(): void {
    this.percent = Math.max(this.percent - 10, 0);
    this.updateEstado();
  }

  updateEstado(): void {
    this.proyecto.estado = `${this.percent}%`;
    this._proyectoService
      .updateProyecto(this.proyecto)
      .subscribe((res: any) => {
        console.log('Estado actualizado', this.proyecto);
      });
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
