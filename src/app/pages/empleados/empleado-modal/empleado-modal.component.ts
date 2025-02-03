import {Component, OnInit, Inject,CUSTOM_ELEMENTS_SCHEMA,} from '@angular/core';
import {FormBuilder,FormGroup, Validator,ReactiveFormsModule,Validators,} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado-modal',
  templateUrl: './empleado-modal.component.html',
  standalone: true,
  styleUrls: ['./empleado-modal.component.css'],
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
export class EmpleadoModalComponent implements OnInit {
  isVisible = false;
  title: string = 'Nuevo Empleado';
  button: boolean = true;
  formGroup!: FormGroup;
  _dialog: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmpleadoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empleadoId: number }
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data && this.data.empleadoId) {
      this.title = 'Editar empleado';
      this.button = false;
      this.loadUserData(this.data.empleadoId);
    }
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      cedula: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{1,10}$/),
          Validators.maxLength(10),
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        ],
      ],
    });
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Permitir números (48-57 corresponden al rango ASCII para 0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  loadUserData(empleadoId:number) {}
  closeModal() {
    this.dialogRef.close();
  }

  verEmpleado() {
    alert(`Detalles del Empleado:
      ID: ${this.formGroup.value.id}}
      Cedula: ${this.formGroup.value.cedula}
      Nombre: ${this.formGroup.value.nombre}
      Apellido: ${this.formGroup.value.apellido}
      Correo: ${this.formGroup.value.correo}`)
  }

  editarEmpleado() {
    alert('Modo edición activado para el empleado');
  }

  onSubmit() {
    if (this.formGroup.valid) {
      alert('Empleado guardado con éxito');
      this.closeModal();
    }
  }
}
