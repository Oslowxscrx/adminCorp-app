import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actividad } from '../../../../interface/actividades/actividades';
import { User } from '../../../../interface/usuarios/usuarios';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../service/user/user.service';
import { ActividadesService } from '../../../../service/actividades.service';
import { ModalProyectosComponent } from '../../modal-proyectos/modal-proyectos.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../service/modal/modal.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actividades-modal',
  standalone: true,
  imports: [FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatInputModule ],
  templateUrl: './actividades-modal.component.html',
  styleUrl: './actividades-modal.component.css'
})
export class ActividadesModalComponent implements OnInit {
  currentActividad = {} as Actividad;
  user: User[] = [];
  title = 'Nueva Actividad';
  hide: boolean = true;
  paramsSubscription!: Subscription;
  loading: boolean = true;
  button: boolean = true;

  estados = ['0%', '10%', '20%', '30%', '40%'];
  formGroup!: FormGroup; // Formulario para validar y gestionar los datos

  constructor(
    private _userService: UsersService,
    private _actividadService: ActividadesService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<ActividadesModalComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: { actividadId: number },
    public dialogRef: MatDialogRef<ModalProyectosComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data && this.data.actividadId) {
      this.title = 'Editar Actividad';
      this.button = false;
      // Llama a un servicio para obtener la información del usuario por ID
      this.getActividadById(this.data.actividadId);
    } else {
      // Manejo adicional si no se proporciona un ID
      this.button = true;
    }
    this.modalCommunicationService.closeModal$.subscribe(() => {
      this._dialogRef.close();
    });
    this._userService.getUsers().subscribe((user: User[]) => {
      this.user = user;
    });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [0],
      nombreActividad: ['', [Validators.required, Validators.maxLength(8)]],
      descripcion: ['', [Validators.required]],
      asignado: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      tiempoEntrega: ['', [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((val) => {
      this.currentActividad = val;
      console.log(val);
    });
  }
  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
  getActividadById(id: number) {
    this.loading = true;
    this._actividadService.getActividadById(id).subscribe({
      next: (response: Actividad) => {
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
    this.currentActividad = response;
    this.formGroup.patchValue({
      id: this.currentActividad.id,
      nombreActividad: this.currentActividad.nombreActividad,
      descripcion: this.currentActividad.descripcion,
      estado: this.currentActividad.estado,
      asignado: this.currentActividad.asignado
        ? this.currentActividad.asignado.firstName
        : '',
    });
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener actividades:', error.error.message);
      this.currentActividad = error.error.data;
    }
    this.loading = false;
  }
  // Método para manejar la creación de un proyecto
  createActividad() {
    this._actividadService
      .createActividad(this.currentActividad)
      .subscribe((res: any) => {
        console.log(this.currentActividad);
        window.location.reload();
      });
  }

  // Método para manejar la actualización de un proyecto
  updateActividad() {
    this._actividadService
      .updateActividad(this.currentActividad)
      .subscribe((res: any) => {
        console.log('update', this.currentActividad);
        window.location.reload();
      });
  }
  closeModal() {
    this.modalCommunicationService.close();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      const nombreAsignado = this.formGroup.value.asignado; // Asegúrate de usar el nombre correcto del control
      const usuarioSeleccionado = this.user.find(
        (user) => user.firstName == nombreAsignado
      );

      if (usuarioSeleccionado) {
        this.currentActividad.asignado = usuarioSeleccionado;

        if (!this.currentActividad.id) {
          this.createActividad();
        } else {
          this.updateActividad();
        }
        this.modalCommunicationService.close();
      } else {
        console.error('actividad no encontrada');
      }
    }
  }
  public onSubmitUpdate(): void {
    if (this.formGroup.valid) {
      const nombreLider = this.formGroup.value.leader; // Asegúrate de usar el nombre correcto del control
      const usuarioSeleccionado = this.user.find(
        (user) => user.firstName === nombreLider
      );

      if (usuarioSeleccionado) {
        this.currentActividad.asignado = usuarioSeleccionado;

        this.updateActividad();
        console.log('Actualización en progreso...', this.currentActividad);
        this.modalCommunicationService.close();
      } else {
        console.error('actividad no encontrado');
      }
    }
  }
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
}
