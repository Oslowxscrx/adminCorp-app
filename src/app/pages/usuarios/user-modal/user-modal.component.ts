import {Component,OnInit,Inject,CUSTOM_ELEMENTS_SCHEMA,} from '@angular/core';
import {FormBuilder,FormGroup,Validator,ReactiveFormsModule,Validators,} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  standalone: true,
  styleUrls: ['./user-modal.component.css'],
  imports: [
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModalComponent implements OnInit {
  isVisible = false;
  title: string = 'Nuevo Usuario';
  button: boolean = true;
  formGroup!: FormGroup;
  _dialog: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data && this.data.userId) {
      this.title = 'Editar Usuario';
      this.button = false;
      this.loadUserData(this.data.userId);
    }
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(15), // Límite máximo de 12 caracteres
        ],
      ],
      rol: ['', [Validators.required]],
      /*fechaCreacion: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],*/
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        ],
      ],
    });
  }

  loadUserData(userId: number) {}
  closeModal() {
    this.dialogRef.close();
  }

  verUsuario() {
    alert(`Detalles del Usuario:
      ID: ${this.formGroup.value.id}
      Usuario: ${this.formGroup.value.usuario}
      Rol: ${this.formGroup.value.rol}
      Fecha de Creación: ${this.formGroup.value.fechaCreacion}`)
  }

  editarUsuario() {
    alert('Modo edición activado para el usuario');
  }

  onSubmit() {
    if (this.formGroup.valid) {
      alert('Usuario guardado con éxito');
      this.closeModal();
    }
  }
}
