import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { Area } from '../../interface/area/area';
import { AreaService } from '../../service/area.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AreaModalComponent } from './area-modal/area-modal.component';
import { AreaModalDeleteComponent } from './area-modal-delete/area-modal-delete.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area',
  standalone: true,
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
  imports: [NzTableModule, NzButtonModule, NzIconModule, CommonModule],
})
export class AreaComponent implements OnInit {
  area: Area[] = [];
  loading: boolean = true;

  constructor(private _areaService: AreaService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this.getArea();
  }
  getArea() {
    this.loading = true;
    this._areaService.getAreas().subscribe({
      next: (response: Area[]) => {
        console.log('areas xd', response);
        this.handleResponse(response);
      },
      error: (error) => {
        this.handleError(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private handleResponse(response: any): void {
    this.area = response;
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener area:', error.error.message);
      this.area = error.error.data;
    }
    this.loading = false;
  }
  openModal(): void {
    const dialogRef = this._dialog.open(AreaModalComponent, {
      height: '410px',
      width: '550px',
      data: {
        /* datos que deseas pasar al componente de contenido del modal */
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Realizar acciones después de cerrar el modal
      }
    });
  }

  openModalArea(areaId: number): void {
    const dialogRef = this._dialog.open(AreaModalComponent, {
      height: '380px',
      width: '550px',
      data: { areaId: areaId },
    });
  }

  deleteUser(area: Area): void {
    this._areaService
      .deleteAreaById(area.id)
      .pipe(
        finalize(() => {
          this.getArea();
          // this._router.navigate(['/system/usuarios']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleResponse(res);
        }
      });
  }

  openModalDeleteArea(area: Area): void {
    const dialogRef = this._dialog.open(AreaModalDeleteComponent, {
      height: '350px',
      width: '500px',
      data: {
        title: '¿ Está seguro de eliminar esta area ?',
        message: 'La area sera eliminado definitivamente del sistema.',
        button: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(area);
      }
    });
  }
}
