import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Actividad } from '../../../interface/actividades/actividades';
import { User } from '../../../interface/usuarios/usuarios';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../service/user/user.service';
import { ActividadesService } from '../../../service/actividades.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { ModalService } from '../../../service/modal/modal.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actividades-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './actividades-modal.component.html',
  styleUrls: ['./actividades-modal.component.css'],
})
export class ActividadesModalComponent implements OnInit {
  currentActividad = {} as Actividad;
  user: User[] = [];
  title = 'Nueva Actividad';
  hide: boolean = true;
  paramsSubscription!: Subscription;
  loading: boolean = true;
  button: boolean = true;
  formGroup!: FormGroup;
  estados = [
    '0%',
    '10%',
    '20%',
    '30%',
    '40%',
    '50%',
    '60%',
    '70%',
    '80%',
    '90%',
    '100%',
  ];

  constructor(
    private _userService: UsersService,
    private _actividadService: ActividadesService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<ActividadesModalComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA)
    public data: { proyectoId: any; actividadId: number }
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data && this.data.actividadId) {
      this.title = 'Editar Actividad';
      this.button = false;
      this.getActividadById(this.data.actividadId);
    } else {
      this.button = true;
    }
    this.modalCommunicationService.closeModal$.subscribe(() => {
      this._dialogRef.close();
    });
    this.loadUser();
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id: [0],
      nombreActividad: ['', [Validators.required, Validators.maxLength(25)]],
      descripcion: ['', [Validators.required]],
      staff: ['', [Validators.required]],
      estado: ['0%', [Validators.required]],
      tiempoEntrega: ['', [Validators.required]],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.currentActividad = val;
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
      proyectoId: this.data.proyectoId,
      staff: this.currentActividad.staff.id,
      estado: this.currentActividad.estado,
      descripcion: this.currentActividad.descripcion,
      tiempoEntrega: this.currentActividad.tiempoEntrega
        ? moment(this.currentActividad.tiempoEntrega).format('YYYY-MM-DD')
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

  createActividad() {
    const actividadData = {
      nombreActividad: this.formGroup.value.nombreActividad,
      proyecto: { id: this.data.proyectoId },
      staff: { id: +this.formGroup.value.staff },
      descripcion: this.formGroup.value.descripcion,
      estado: this.formGroup.value.estado,
      tiempoEntrega: moment(this.formGroup.value.tiempoEntrega).format(
        'YYYY-MM-DDTHH:mm:ss'
      ),
    };

    this._actividadService.createActividad(actividadData).subscribe({
      next: () => {
        this.modalCommunicationService.close();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al crear actividad:', error);
        if (error.status === 403) {
          alert('No tienes permisos para realizar esta acción.');
        }
      },
    });
  }

  updateActividad() {
    const actividadData = {
      id: this.currentActividad.id,
      nombreActividad: this.formGroup.value.nombreActividad,
      proyecto: { id: this.data.proyectoId },
      staff: { id: +this.formGroup.value.staff },
      descripcion: this.formGroup.value.descripcion,
      estado: this.formGroup.value.estado,
      tiempoEntrega: moment(this.formGroup.value.tiempoEntrega).format(
        'YYYY-MM-DDTHH:mm:ss'
      ),
    };
    console.log(
      'Actualizando actividad con los siguientes datos:',
      actividadData
    );
    this._actividadService.updateActividad(actividadData).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al actualizar actividad:', error);
        if (error.status === 403) {
          alert('No tienes permisos para realizar esta acción.');
        }
      },
    });
  }

  closeModal() {
    this.modalCommunicationService.close();
  }

  private loadUser(): void {
    this._userService.getUsers().subscribe(
      (usuarios: User[]) => {
        this.user = usuarios.filter((user) => user.role === 'STAFF');
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    );
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      if (!this.currentActividad.id) {
        this.createActividad();
      } else {
        this.updateActividad();
      }
      this.modalCommunicationService.close();
    }
  }
  public onSubmitUpdate(): void {
    if (this.formGroup.valid) {
      const actividadData = {
        id: this.currentActividad.id, // Asegúrate de incluir el ID de la actividad
        nombreActividad: this.formGroup.value.nombreActividad,
        proyecto: { id: this.data.proyectoId },
        staff: { id: +this.formGroup.value.staff },
        descripcion: this.formGroup.value.descripcion,
        estado: this.formGroup.value.estado,
        tiempoEntrega: moment(this.formGroup.value.tiempoEntrega).format(
          'YYYY-MM-DDTHH:mm:ss'
        ),
      };

      console.log(
        'Actualizando actividad con los siguientes datos:',
        actividadData
      );

      this._actividadService.updateActividad(actividadData).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al actualizar actividad:', error);
          if (error.status === 403) {
            alert('No tienes permisos para realizar esta acción.');
          }
        },
      });
      this.modalCommunicationService.close();
    }
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  increaseProgress(): void {
    let currentProgress = parseInt(this.formGroup.get('estado')?.value);
    currentProgress = Math.min(currentProgress + 10, 100);
    this.formGroup.patchValue({ estado: `${currentProgress}%` });
  }

  decreaseProgress(): void {
    let currentProgress = parseInt(this.formGroup.get('estado')?.value);
    currentProgress = Math.max(currentProgress - 10, 0);
    this.formGroup.patchValue({ estado: `${currentProgress}%` });
  }
}
