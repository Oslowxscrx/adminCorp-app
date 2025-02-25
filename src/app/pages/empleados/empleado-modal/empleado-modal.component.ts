import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Employee } from '../../../interface/employee/employee';
import { ModalService } from '../../../service/modal/modal.service';
import { EmpleadosService } from '../../../service/empleados.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Inject,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

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
})
export class EmpleadoModalComponent implements OnInit {
  currentEmpleado = {} as Employee;
  title: string = 'Nuevo Empleado';
  hide: boolean = true;
  loading: boolean = true;
  button: boolean = true;
  paramsSubscription!: Subscription;
  formGroup!: FormGroup;

  constructor(
    private _empleadosService: EmpleadosService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<EmpleadoModalComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: { empleadoId: number }
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data && this.data.empleadoId) {
      this.title = 'Editar empleado';
      this.button = false;
      this.getEmpleadoById(this.data.empleadoId);
    } else {
      // Manejo adicional si no se proporciona un ID
      this.button = true;
    }
    this.modalCommunicationService.closeModal$.subscribe(() => {
      this._dialogRef.close();
    });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [0],
      cedula: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        },
      ],
      nombreEmpleado: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      apellidoEmpleado: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      correoEmpleado: ['', [Validators.required, Validators.email]],
    });
    this.formGroup.valueChanges.subscribe((val) => {
      this.currentEmpleado = val;
      console.log(val);
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  getEmpleadoById(id: number) {
    this.loading = true;
    this._empleadosService.getEmployeeById(id).subscribe({
      next: (response: Employee) => {
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
    this.currentEmpleado = response;
    this.formGroup.patchValue(this.currentEmpleado);
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener proyectos:', error.error.message);
      this.currentEmpleado = error.error.data;
    }
    this.loading = false;
  }

  public createEmpleado() {
    const empleadoData = { ...this.formGroup.value };
    delete empleadoData.id; // Eliminar el campo id para la creación

    this._empleadosService.createEmployee(empleadoData).subscribe({
      next: (res: any) => {
        console.log('Empleado creado:', empleadoData);
        this.modalCommunicationService.close();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al crear empleado:', error);
        if (error.status === 403) {
          alert('No tienes permisos para realizar esta acción.');
        }
      }
    });
  }

  updateEmpleado() {
    this._empleadosService
      .updateEmployee(this.currentEmpleado)
      .subscribe((res: any) => {
        console.log('update', this.currentEmpleado);
        window.location.reload();
      });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Permitir números (48-57 corresponden al rango ASCII para 0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  closeModal() {
    this._dialogRef.close();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      if (!this.currentEmpleado.id) {
        this.createEmpleado();
        console.log('entraaa crear');
        this.modalCommunicationService.close();
      } else {
        this.updateEmpleado();
        console.log('entraaa editar');
        this.modalCommunicationService.close();
      }
    }
  }

  public onSubmitUpdate(): void {
    // Actualiza los datos del formulario en el objeto currentEmpleado
    this.currentEmpleado = { ...this.currentEmpleado, ...this.formGroup.value };
    this.updateEmpleado();
    console.log('entraaa editarxd');
    this.modalCommunicationService.close();
  }
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
}
