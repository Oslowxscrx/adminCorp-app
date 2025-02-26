import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MatDialog } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Actividad } from '../../interface/actividades/actividades';
import { ActividadesService } from '../../service/actividades.service';
import { ActividadesModalComponent } from './actividades-modal/actividades-modal.component';
import { ProgressModalActividadComponent } from './modal-estado-actividad/modal-estado-actividad.component';
import { ActividadesModalDeleteComponent } from './actividades-modal-delete/actividades-modal-delete.component';

@Component({
  selector: 'app-actividades',
  imports: [CommonModule, NzButtonModule, NzEmptyModule, NzCardModule],
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.css',
})
export class ActividadesComponent implements OnInit {
  actividad: any[] = [];
  proyectoId: string | null = null;
  loading: boolean = true;
  colores: string[] = [
    '#FFB3BA',
    '#FFDFBA',
    '#FFFFBA',
    '#BAFFC9',
    '#BAE1FF',
    '#D1C4E9',
    '#F8BBD0',
    '#E1BEE7',
    '#FFCDD2',
    '#C5CAE9',
    '#BBDEFB',
    '#B3E5FC',
    '#B2EBF2',
    '#B2DFDB',
    '#C8E6C9',
    '#DCEDC8',
    '#F0F4C3',
    '#FFF9C4',
    '#FFECB3',
    '#FFE0B2',
    '#FFCCBC',
    '#D7CCC8',
    '#F5F5F5',
    '#CFD8DC',
  ];

  constructor(
    private _actividadesService: ActividadesService,
    private _dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id');
    this.getActivitiesByStaffId();
  }

  getActivitiesByStaffId(): void {
    console.log('proyectoid', this.proyectoId)
    const proyectoIdNumber = this.proyectoId ? +this.proyectoId : 0;
    this._actividadesService.getActividadByStaffId(proyectoIdNumber).subscribe({
      next: (res: any) => {
        console.log('Actividades por staff', res);
        this.actividad = res.map((actividad: any) => ({
          ...actividad,
          color: this.getRandomColor(),
        }));
        this.handleResponse(this.actividad);
      },
      error: (error) => {
        console.error('Error al obtener actividades por staff:', error);
      },
    });
  }

  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colores.length);
    return this.colores[randomIndex];
  }

  private handleResponse(response: any): void {
    this.actividad = response;
    this.loading = false;
  }
  private handleError(error: any): void {
    if (error.status === 404) {
      function finalize(
        arg0: () => void
      ): import('rxjs').OperatorFunction<Actividad, unknown> {
        throw new Error('Function not implemented.');
      }

      console.error('Error al obtener proyecto:', error.error.message);
      this.actividad = error.error.data;
    }
    this.loading = false;
  }
  openModal(): void {
    const proyectoIdNumber = this.proyectoId ? +this.proyectoId : 0;
    const dialogRef = this._dialog.open(ActividadesModalComponent, {
      height: '710px',
      width: '550px',
      data: {
        proyectoId: proyectoIdNumber,
        /* datos que deseas pasar al componente de contenido del modal */
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Realizar acciones después de cerrar el modal
      }
    });
  }
  openModalActividad(actividadId: number): void {
    const proyectoIdNumber = this.proyectoId ? +this.proyectoId : 0;
    const dialogRef = this._dialog.open(ActividadesModalComponent, {
      height: '580px',
      width: '550px',
      data: { actividadId: actividadId, proyectoId: proyectoIdNumber, },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Realizar acciones después de cerrar el modal
      }
    });
  }
    getActividad() {
      this.loading = true;
      const response = this._actividadesService.getActividad().subscribe({
        next: (response: Actividad[]) => {
          console.log('proyectos', response);
          this.actividad = response.map((actividad) => ({
            ...actividad,
            color: this.getRandomColor(),
          }));
          this.handleResponse(this.actividad);
        },
        error: (error) => {
          this.handleError(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  deleteActividad(actividad: Actividad): void {
    this._actividadesService
      .deleteActividadById(actividad.id)
      .pipe(
        finalize(() => {
          this.getActividad();
          // this._router.navigate(['/system/usuarios']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleResponse(res);
        }
      });
  }
  openModalDeleteUsuario(actividad: Actividad): void {
    const dialogRef = this._dialog.open(ActividadesModalDeleteComponent, {
      height: '230px',
      width: '300px',
      data: {
        title: '¿Está seguro de eliminar esta actividad?',
        message: 'La actividad será eliminado permanentemente del sistema.',
        button: 'Eliminar',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteActividad(actividad);
      }
    });
  }
  openProgressModalActividad(actividad: Actividad): void {
    if (actividad && actividad.estado) {
      const dialogRef = this._dialog.open(ProgressModalActividadComponent, {
        width: '400px',
        data: { actividad: actividad },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          // this.getActividades();
        }
      });
    } else {
      console.error('La actividad no tiene la propiedad estado definida.');
    }
  }
}
