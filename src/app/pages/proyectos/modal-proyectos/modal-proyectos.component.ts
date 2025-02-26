import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../interface/usuarios/usuarios';
import { Proyecto } from '../../../interface/proyectos/proyectos';
import { UsersService } from '../../../service/user/user.service';
import { ModalService } from '../../../service/modal/modal.service';
import { ProyectosService } from '../../../service/proyectos.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-modal-proyectos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './modal-proyectos.component.html',
  styleUrls: ['./modal-proyectos.component.css'],
})
export class ModalProyectosComponent implements OnInit {
  currentProyecto = {} as Proyecto;
  user: User[] = [];
  title = 'Nuevo Proyecto';
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
    private _proyectoService: ProyectosService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<ModalProyectosComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: { proyectoId: number },
    public dialogRef: MatDialogRef<ModalProyectosComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data && this.data.proyectoId) {
      this.title = 'Editar Proyecto';
      this.button = false;
      // Llama a un servicio para obtener la información del usuario por ID
      this.getProyectoById(this.data.proyectoId);
    } else {
      // Manejo adicional si no se proporciona un ID
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
      titulo: ['', [Validators.required, Validators.maxLength(8)]],
      descripcion: ['', [Validators.required]],
      estado: ['0%', [Validators.required]],
      leader: ['', [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((val) => {
      this.currentProyecto = val;
      console.log(val);
    });
  }
  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
  getProyectoById(id: number) {
    this.loading = true;
    this._proyectoService.getProyectoById(id).subscribe({
      next: (response: Proyecto) => {
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
    this.currentProyecto = response;
    this.formGroup.patchValue({
      id: this.currentProyecto.id,
      titulo: this.currentProyecto.titulo,
      descripcion: this.currentProyecto.descripcion,
      estado: this.currentProyecto.estado,
      leader: this.currentProyecto.leader
        ? this.currentProyecto.leader.firstName
        : '',
    });
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error('Error al obtener proyectos:', error.error.message);
      this.currentProyecto = error.error.data;
    }
    this.loading = false;
  }
  // Método para manejar la creación de un proyecto
  public createProyecto() {
    const proyectoData = { ...this.formGroup.value };
    delete proyectoData.id; // Eliminar el campo id para la creación

    this._proyectoService.createProyecto(proyectoData).subscribe({
      next: (res: any) => {
        console.log('Proyecto creado:', proyectoData);
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

  // Método para manejar la actualización de un proyecto
  updateProjecto() {
    this._proyectoService
      .updateProyecto(this.currentProyecto)
      .subscribe((res: any) => {
        console.log('update', this.currentProyecto);
        window.location.reload();
      });
  }
  closeModal() {
    this.modalCommunicationService.close();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      const nombreLider = this.formGroup.value.leader;
      // Filtrar usuarios que tengan el rol LEADER
      const liderSeleccionado = this.user.find(
        (user) => user.firstName === nombreLider && user.role === 'LEADER'
      );
  
      if (liderSeleccionado) {
        this.currentProyecto.leader = liderSeleccionado;
  
        if (!this.currentProyecto.id) {
          this.createProyecto();
        } else {
          this.updateProjecto();
        }
        this.modalCommunicationService.close();
      } else {
        console.error('Líder no encontrado o no tiene el rol LEADER');
      }
    }
  }
  public onSubmitUpdate(): void {
    if (this.formGroup.valid) {
      const nombreLider = this.formGroup.value.leader; // Asegúrate de usar el nombre correcto del control
      const liderSeleccionado = this.user.find(
        (user) => user.firstName === nombreLider && user.role === 'LEADER'
      );

      if (liderSeleccionado) {
        this.currentProyecto.leader = liderSeleccionado;

        this.updateProjecto();
        console.log('Actualización en progreso...', this.currentProyecto);
        this.modalCommunicationService.close();
      } else {
        console.error('Líder no encontrado o no tiene el rol LEADER');
      }
    }
  }
  private loadUser(): void {
    this._userService.getUsers().subscribe(
      (usuarios: User[]) => {
        // Filtrar usuarios que tengan el rol LEADER
        this.user = usuarios.filter(user => user.role === 'LEADER');
      },
      (error) => {
        console.error("Error al cargar usuarios:", error);
        this.loading = false;
      }
    );
  }
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
  // Métodos para manejar el progreso
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
