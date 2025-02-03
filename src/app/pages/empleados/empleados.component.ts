import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EmpleadoModalComponent } from './empleado-modal/empleado-modal.component';
import { FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

interface Empleado {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  fechaCreacion: Date;
}

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [NzDividerModule, NzTableModule, NzButtonModule, MatDialogModule, CommonModule, NzIconModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})

export class EmpleadosComponent {

  currentRegister = {} as Empleado;
  empleados: Empleado[] = [];
  title = 'Nuevo Registro';
  hide: boolean = true;
  loading: boolean = true;

  // Tamaño del botón
  size: 'small' | 'default' | 'large' = 'default';

  public formGroup!: FormGroup;

  empleadoEditando = {
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    fechaCreacion: ''
  };

  empleado: any[] = [];
  currentEmpleado = {} as Empleado;
  modalAbierto = false;

  constructor(
    private _dialog: MatDialog,
  ) { }

  openModal(): void {
    const dialogRef = this._dialog.open(EmpleadoModalComponent, {
      height: '550px',
      width: '550px',
      data: {}  // Pasar datos necesarios al modal
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

  // Método para agregar un usuario
  agregarEmpleado() {
    const nuevoEmpleado: Empleado = {
      id: this.empleados.length + 1,
      nombre: `Nuevo Empleado ${this.empleados.length + 1}`,
      cedula: '',
      apellido: '',
      correo: '',
      fechaCreacion: new Date()
    };
    this.empleados.push(nuevoEmpleado);
  }

  // Método para ver los detalles de un empleado
  verEmpleado(id: number): void {
    const empleado = this.empleados.find(u => u.id === id);
    if (empleado) {
    }
  }

  // Método para editar un empleado
  editarEmpleado(id: number): void {
    this.abrirModalParaEditar(id);
  }

  // Método para eliminar un empleado
  eliminarEmpleado(id: number): void {
    this.empleados = this.empleados.filter(empleado => empleado.id !== id);
  }

   // Método para formatear la fecha
   obtenerFechaActual(): string {
    const fecha = new Date();
    return fecha.toISOString();
  }

  limpiarFormulario(): void {
    this.empleadoEditando = {
      cedula: '',
      nombre:'',
      apellido: '',
      correo: '',
      fechaCreacion: ''
    };
  }
}
