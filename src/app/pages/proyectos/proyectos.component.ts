import { finalize, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MatDialog } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Proyecto } from '../../interface/proyectos/proyectos';
import { ProyectosService } from '../../service/proyectos.service';
import { ModalProyectosComponent } from './modal-proyectos/modal-proyectos.component';
import { ProyectosModalDeleteComponent } from './proyectos-modal-delete/proyectos-modal-delete.component';
import { ProgressModalComponent } from './modal-estado/modal-estado.component';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzEmptyModule,
    NzCardModule,
    RouterModule,
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  title = 'Nuevo Registro';
  proyectos: Proyecto[] = [];
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
  modalAbierto = false;
  constructor(
    private _proyectoService: ProyectosService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProyectos();
  }

  getProyectos() {
    this.loading = true;
    const response = this._proyectoService.getProyectos().subscribe({
      next: (response: Proyecto[]) => {
        console.log('proyectos', response);
        this.proyectos = response.map((proyecto) => ({
          ...proyecto,
          color: this.getRandomColor(),
        }));
        this.handleResponse(this.proyectos);
      },
      error: (error) => {
        this.handleError(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colores.length);
    return this.colores[randomIndex];
  }

  private handleResponse(response: any): void {
    this.proyectos = response;
    this.loading = false;
  }
  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener proyecto:', error.error.message);
      this.proyectos = error.error.data;
    }
    this.loading = false;
  }
  openModal(): void {
    const dialogRef = this._dialog.open(ModalProyectosComponent, {
      height: '710px',
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
  openModalProyecto(proyectoId: number): void {
    const dialogRef = this._dialog.open(ModalProyectosComponent, {
      height: '580px',
      width: '550px',
      data: { proyectoId: proyectoId },
    });
  }
  deleteProyecto(proyecto: Proyecto): void {
    this._proyectoService
      .deleteProyectoById(proyecto.id)
      .pipe(
        finalize(() => {
          this.getProyectos();
          // this._router.navigate(['/system/usuarios']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleResponse(res);
        }
      });
  }
  openModalDeleteUsuario(proyecto: Proyecto): void {
    const dialogRef = this._dialog.open(ProyectosModalDeleteComponent, {
      height: '230px',
      width: '300px',
      data: {
        title: '¿Está seguro de eliminar este proyecto?',
        message: 'El proyecto será eliminado permanentemente del sistema.',
        button: 'Eliminar',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteProyecto(proyecto);
      }
    });
  }
    // Métodos para manejar el progreso
    openProgressModal(proyecto: Proyecto): void {
      const dialogRef = this._dialog.open(ProgressModalComponent, {
        width: '400px',
        data: { proyecto: proyecto },
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.getProyectos();
        }
      });
    }
}
