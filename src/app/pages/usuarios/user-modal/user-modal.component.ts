import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { User } from '../../../interface/usuarios/usuarios';
import { AuthService } from '../../../service/auth.service';
import { RoleEnum, RoleEnumKeys } from '../../../enums/role';
import { UsersService } from '../../../service/user/user.service';
import { ModalService } from '../../../service/modal/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalProyectosComponent } from '../../proyectos/modal-proyectos/modal-proyectos.component';
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
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';

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
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModalComponent implements OnInit {
  currentUser = {} as User;
  title: string = 'Nuevo Usuario';
  hide: boolean = true;
  paramsSubscription!: Subscription;
  loading: boolean = true;
  passwordEntered: boolean = false;
  button: boolean = true;
  formGroup!: FormGroup;
  roles = RoleEnum; 
  
  constructor(
    private _userService: UsersService,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<ModalProyectosComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data && this.data.userId) {
      this.title = 'Editar Usuario';
      this.button = false;
      this.getUserById(this.data.userId);
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
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', this.data && this.data.userId ? [] : [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((val) => {
      this.currentUser = val;
      console.log(val);
    });
  }
  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
  getUserById(id: number) {
    this.loading = true;
    this._userService.getUserById(id).subscribe({
      next: (response: User) => {
        this.currentUser = response;
        this.formGroup.patchValue(this.currentUser);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.handleError(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error al obtener usuario:', error);
  }
  createUser() {
    this.authService.register(this.formGroup.value).subscribe((res: any) => {
      try {
        console.log('Usuario creado:', res);
        this.modalCommunicationService.close();
      } catch (e) {
        console.error(e);
      }
    });
  }
  updateUser() {
    this._userService.updateUser(this.formGroup.value).subscribe((res: any) => {
      console.log('Usuario actualizado:', res);
      // Aquí podrías añadir lógica adicional después de actualizar el usuario, como cerrar el modal, recargar la lista, etc.
      this.modalCommunicationService.close();
    });
  }
  closeModal() {
    this.modalCommunicationService.close();
  }
  onSubmit() {
    if (this.formGroup.valid) {
      this.createUser();
    }
  }
  onSubmitUpdate() {
    if (this.formGroup.valid) {
      this.updateUser();
    }
  }
  onPasswordInput() {
    this.passwordEntered =
      this.formGroup.get('password')?.value.trim().length > 0;
  }
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
  getRoleKeys(): RoleEnumKeys[] {
    return Object.keys(RoleEnum) as RoleEnumKeys[];
  }
}
