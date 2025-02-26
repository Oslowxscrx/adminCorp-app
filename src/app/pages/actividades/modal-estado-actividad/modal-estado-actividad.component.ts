import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconService, NzIconModule } from 'ng-zorro-antd/icon';
import { MinusOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { Actividad } from '../../../interface/actividades/actividades';
import { ActividadesService } from '../../../service/actividades.service';

@Component({
  selector: 'app-progress-modal-actividad',
  templateUrl: './modal-estado-actividad.component.html',
  styleUrls: ['./modal-estado-actividad.component.css'],
  imports: [NzProgressModule, NzButtonModule, NzIconModule],
})
export class ProgressModalActividadComponent implements OnInit {
  actividad: Actividad;
  percent: number;

  constructor(
    public dialogRef: MatDialogRef<ProgressModalActividadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { actividad: Actividad },
    @Inject(ActividadesService) private _actividadService: ActividadesService,
    private iconService: NzIconService
  ) {
    this.actividad = data.actividad;
    this.percent = parseInt(this.actividad.estado);
    this.iconService.addIcon(MinusOutline, PlusOutline);
  }

  ngOnInit(): void {
    if (!this.actividad || !this.actividad.estado) {
      console.error('La actividad no tiene la propiedad estado definida.');
    }
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
    this.actividad.estado = `${this.percent}%`;
    this._actividadService.updateActividad(this.actividad).subscribe((res: any) => {
      console.log('Estado actualizado', this.actividad);
    });
  }

  close(): void {
    this.dialogRef.close(true);
  }
}