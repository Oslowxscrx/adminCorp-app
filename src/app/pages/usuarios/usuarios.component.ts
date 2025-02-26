import { Component } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { User } from '../../interface/usuarios/usuarios';
import { UsersService } from '../../service/user/user.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UserModalDeleteComponent } from './user-modal-delete/user-modal-delete.component';
@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
    MatDialogModule,
    CommonModule,
    NzIconModule,
    NzEmptyModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuarioComponent {
  usuarios: User[] = [];
  title = 'Nuevo Registro';
  loading: boolean = true;
  usuario: any[] = [];
  constructor(
    private _usersService: UsersService,
    private _dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getUsuarios();
  }
  openModal(): void {
    const dialogRef = this._dialog.open(UserModalComponent, {
      height: '650px',
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

  abrirModalParaEditar(userId: number): void {
    const dialogRef = this._dialog.open(UserModalComponent, {
      height: '550px',
      width: '550px',
      data: { userId: userId },
    });
  }

  getUsuarios() {
    this.loading = true;
    const response = this._usersService.getUsers().subscribe({
      next: (response: User[]) => {
        console.log('Respuesta del servicio:', response);
        this.handleResponse(response); // Agrega este console.log para verificar la respuesta
        this.usuarios = response; // Asigna la respuesta a this.users
        this.loading = false;
      },

      error: (error) => {
        this.handleError(error);
        console.error('Error al obtener usuarios:', error);
        this.loading = false;
      },
    });
  }

  private handleResponse(response: any): void {
    this.usuario = response;
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener usuarios:', error.error.message);
      this.usuario = error.error.data;
    }
    this.loading = false;
  }
  deleteUser(user: User): void {
    this._usersService
      .deleteUserById(user.id)
      .pipe(
        finalize(() => {
          this.getUsuarios();
          // this._router.navigate(['/system/usuarios']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleResponse(res);
        }
      });
  }
  openModalDeleteUsuario(user: User): void {
    const dialogRef = this._dialog.open(UserModalDeleteComponent, {
      height: '230px',
      width: '300px',
      data: {
        title: '¿Está seguro de eliminar este usuario?',
        message: 'El usuario será eliminado permanentemente del sistema.',
        button: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Verifica si el usuario confirmó la eliminación
        this.deleteUser(user);
      }
    });
  }
}
