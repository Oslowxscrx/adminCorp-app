import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProyectosService } from '../../../service/proyectos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proyecto } from '../../../interface/proyectos/proyectos';
import { Subscription } from 'rxjs';
import { EmpleadosService } from '../../../service/empleados.service';
import { Employee } from '../../../interface/employee/employee';
import { ModalService } from '../../../service/modal/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-proyectos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './modal-proyectos.component.html',
  styleUrls: ['./modal-proyectos.component.css'],
})
export class ModalProyectosComponent implements OnInit {
  currentProyecto = {} as Proyecto;
  empleado: Employee[] = [];
  title = 'Nuevo Proyecto';
  hide: boolean = true;
  paramsSubscription!: Subscription;
  loading: boolean = true;
  button: boolean = true;

  estados = ['0%', '10%', '20%', '30%', '40%'];
  formGroup!: FormGroup;  // Formulario para validar y gestionar los datos

  constructor(
    private _empleadoService: EmpleadosService,
    private _proyectoService: ProyectosService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<ModalProyectosComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: { proyectoId: number },
    public dialogRef: MatDialogRef<ModalProyectosComponent>,
  ) { 
    this.initForm(); 
  }

  ngOnInit(): void {
    if (this.data && this.data.proyectoId) {
      this.title = 'Editar Proyecto'
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
    this._empleadoService.getEmployees().subscribe((empleado: Employee[]) => {
      this.empleado = empleado;
    });
  }

  initForm() {
    this.formGroup = this._formBuilder.group({
      id:[0],
      titulo: ['', [Validators.required, Validators.maxLength(8)]],
      descripcion: ['', [Validators.required, ]],
      estado: ['', [Validators.required]]
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
      }
    });
  }
  private handleResponse(response: any): void {
    this.currentProyecto = response;
    this.formGroup.patchValue({
      id: this.currentProyecto.id,
      titulo: this.currentProyecto.titulo,
      descripcion: this.currentProyecto.descripcion,
      estado: this.currentProyecto.estado,
      // Verificar si la categoría está definida y asignar su nombre
      lider: this.currentProyecto.lider ? this.currentProyecto.lider.nombreEmpleado : '',
    });
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error("Error al obtener proyectos:", error.error.message);
      this.currentProyecto = error.error.data
    }
    this.loading = false;
  }
  // Método para manejar la creación de un proyecto
  createProjecto() {
    this._proyectoService.createProyecto(this.currentProyecto).subscribe((res: any) => {
      console.log(this.currentProyecto);
    });
  }

  // Método para manejar la actualización de un proyecto
  updateProjecto() {
    this._proyectoService.updateProyecto(this.currentProyecto).subscribe((res: any) => {
      console.log('update',this.currentProyecto);
    });
  }
  closeModal() {
    this.modalCommunicationService.close();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
    const nombreEmpleado = this.formGroup.value.nombreEmpleado;
    const empleadoSeleccionado = this.empleado.find(cat => cat.nombreEmpleado === nombreEmpleado);
    if (empleadoSeleccionado) {
      this.currentProyecto.lider = empleadoSeleccionado;
      
      if (!this.currentProyecto.id) {
        this.createProjecto();
      } else {
        this.updateProjecto();
      }
      this.modalCommunicationService.close();
      } else {
      console.error('empelado no encontrado');
      }
    }
  }
  public onSubmitUpdate(): void {
    if (this.formGroup.valid) {
      const nombreEmpleado = this.formGroup.value.nombreEmpleado;
      const empleadoSeleccionado = this.empleado.find(cat => cat.nombreEmpleado === nombreEmpleado);
      
      if (empleadoSeleccionado) {
        // Asignar la categoría seleccionada al objeto currentAssets
        this.currentProyecto.lider = empleadoSeleccionado;
        
        // Ahora puedes enviar la solicitud de actualización
        this.updateProjecto();
        console.log('Actualización en progreso...', this.currentProyecto);
        this.modalCommunicationService.close();
      } else {
        console.error('empleado no encontrado');
      }
    }
  }
  private loadEmplado(): void {
    this._empleadoService.getEmployees().subscribe(
      (empleados: Employee[]) => {
        this.empleado = empleados;
      },
      (error) => {
        console.error("Error al cargar empleados:", error);
        this.loading = false;
      }
    );
  }
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
