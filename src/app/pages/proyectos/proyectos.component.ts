import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalProyectosComponent } from './modal-proyectos/modal-proyectos.component';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Proyecto } from '../../interface/proyectos/proyectos';
import { ProyectosService } from '../../service/proyectos.service';



@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzEmptyModule,
    NzCardModule,
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  loading: boolean = true;

  constructor(
    private _proyectoService: ProyectosService, 
    private _dialog: MatDialog,
  ) 
  
  { }

  ngOnInit(): void {
    this.getProyectos();
  }

  getProyectos() {
    this.loading = true;
    this._proyectoService.getProyectos().subscribe({
      next: (response: Proyecto[]) => {
        console.log('proyectos',response);
        this.handleResponse(response);
      },
      error: (error) => {
        this.handleError(error);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
  private handleResponse(response: any): void {
    this.proyectos = response;
    this.loading = false;
  }
  private handleError(error: any): void {
    if (error.status === 404) {function finalize(arg0: () => void): import("rxjs").OperatorFunction<Proyecto, unknown> {
      throw new Error('Function not implemented.');
    }
    
      console.error("Error al obtener proyecto:", error.error.message);
      this.proyectos = error.error.data
    }
    this.loading = false;
  }
  openModal(): void {
    const dialogRef = this._dialog.open(ModalProyectosComponent, {
      height: '710px',
      width: '550px',
      data: { /* datos que deseas pasar al componente de contenido del modal */ }
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
    this._proyectoService.deleteProyectoById(proyecto.id)
      .pipe(
        finalize(() => {
          // this._router.navigate(['/system/usuarios']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleResponse(res);
        }
      });
  }
  
}

