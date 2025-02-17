import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserModalComponent } from './user-modal/user-modal.component';
import { FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  fechaCreacion: Date;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [NzDividerModule, NzTableModule, NzButtonModule, MatDialogModule, CommonModule, NzIconModule, NzEmptyModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuarioComponent {

  currentRegister = {} as Usuario;
  usuarios: Usuario[] = [];
  title = 'Nuevo Registro';
  hide: boolean = true;
  loading: boolean = true;
  passwordEntered: boolean = false;

  // Tamaño del botón
  size: 'small' | 'default' | 'large' = 'default';

  public formGroup!: FormGroup;



  usuarioEditando = {
    Usuario: '',
    rol: '',
    fechaCreacion: ''
  };

  usuario: any[] = [];
  currentUser = {} as Usuario;
  modalAbierto = false;
  roles: any[] = [];

  constructor(
    private _dialog: MatDialog,
  ) { }

  openModal(): void {
    const dialogRef = this._dialog.open(UserModalComponent, {
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
  abrirModalParaEditar(userId: number): void {
    const dialogRef = this._dialog.open(UserModalComponent, {
      height: '500px',
      width: '550px',
      data: { userId: userId },
    });
  }

  // Método para agregar un usuario
  agregarUsuario() {
    const nuevoUsuario = {
      id: this.usuarios.length + 1,
      nombre: `Nuevo Usuario ${this.usuarios.length + 1}`,
      rol: 'User',
      fechaCreacion: new Date()
    };
    this.usuarios.push(nuevoUsuario);
  }

  // Método para ver los detalles de un usuario
  verUsuario(id: number): void {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
    }
  }

  // Método para editar un usuario
  editarUsuario(id: number): void {
    this.abrirModalParaEditar(id);
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: number): void {
    this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
  }

  // Método para formatear la fecha
  obtenerFechaActual(): string {
    const fecha = new Date();
    return fecha.toISOString();
  }

  limpiarFormulario(): void {
    this.usuarioEditando = {
      Usuario: '',
      rol: '',
      fechaCreacion: ''
    };
  }
}
