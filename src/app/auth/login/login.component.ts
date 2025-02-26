import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Component, OnInit } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../service/auth.service';
import { MyErrorStateMatcher } from '../../material/matcher/error-state-matcher';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loading: boolean = false;
  loginForm!: FormGroup;
  passwordEntered: boolean = false;
  errorMatcher = new MyErrorStateMatcher();
  loginError: boolean = false; // Nueva propiedad para manejar el estado de error

  constructor(
    private authHttpService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Verifica si el usuario ya está autenticado y redirige si es necesario
    if (this.authHttpService.isAuthenticated()) {
      this.router.navigate(['/system']);
    }
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login();
    }
  }

  login(): void {
    this.loading = true;
    const { userName, password } = this.loginForm.value;
    this.authHttpService.login(userName, password).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          this.router.navigate(['/system']); // Navega a '/system' si el login es exitoso
        } else {
          this.showInputErrors();
          this.loginError = true; // Mostrar la alerta de error
          console.error('Error en el inicio de sesión:', response.message);
          this.authHttpService.logout().subscribe(() => {
            // Limpiar sesión en caso de error
            console.log('Sesión limpia');
          });
        }
      },
      error: (error) => {
        this.showInputErrors();
        this.loginError = true; // Mostrar la alerta de error
        console.error('Error en la solicitud de login:', error);
        this.authHttpService.logout().subscribe(() => {
          // Limpiar sesión en caso de error
          console.log('Sesión limpia');
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onPasswordInput() {
    this.passwordEntered =
      this.loginForm.get('password')?.value.trim().length > 0;
  }

  showInputErrors(): void {
    this.loginForm.controls['userName'].setErrors({ incorrect: true });
    this.loginForm.controls['password'].setErrors({ incorrect: true });
  }
}
