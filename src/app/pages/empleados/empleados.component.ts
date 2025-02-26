import { finalize } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Employee } from '../../interface/employee/employee';
import { EmpleadosService } from '../../service/empleados.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EmpleadoModalComponent } from './empleado-modal/empleado-modal.component';
import { EmpleadoModalDeleteComponent } from './empleado-modal-delete/empleado-modal-delete.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
    MatDialogModule,
    CommonModule,
    NzIconModule,
    NzEmptyModule
  ],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent {
  empleados: Employee[] = [];
  loading: boolean = true;

  constructor(
    private _empleadoService: EmpleadosService,
    private _dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getEmpleado();
  }
  getEmpleado() {
    this.loading = true;
    this._empleadoService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        console.log('empleados', response);
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
    this.empleados = response;
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener horario:', error.error.message);
      this.empleados = error.error.data;
    }
    this.loading = false;
  }
  openModal(): void {
    const dialogRef = this._dialog.open(EmpleadoModalComponent, {
      height: '725px',
      width: '550px',
      data: {}, // Pasar datos necesarios al modal
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Realizar acciones después de cerrar el modal
      }
    });
  }

  // Función para abrir el modal de edición
  abrirModalParaEditar(empleadoId: number): void {
    const dialogRef = this._dialog.open(EmpleadoModalComponent, {
      height: '500px',
      width: '550px',
      data: { empleadoId: empleadoId },
    });
  }
  deleteEmpleado(empleado: Employee): void {
    this._empleadoService
      .deleteEmployeeById(empleado.id)
      .pipe(
        finalize(() => {
          this.getEmpleado();
          // this._router.navigate(['/system/usuarios']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleResponse(res);
        }
      });
  }
  openModalDeleteUsuario(empleado: Employee): void {
    const dialogRef = this._dialog.open(EmpleadoModalDeleteComponent, {
      height: '230px',
      width: '300px',
      data: {
        title: '¿Está seguro de eliminar este empleado?',
        message: 'El empleado será eliminado permanentemente del sistema.',
        button: 'Eliminar',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteEmpleado(empleado);
      }
    });
  }
}
