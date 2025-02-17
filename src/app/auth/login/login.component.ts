import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MyErrorStateMatcher } from '../../material/matcher/error-state-matcher';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { HttpClientModule } from '@angular/common/http';
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
  ]
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loading: boolean = false;
  loginForm!: FormGroup;
  passwordEntered: boolean = false;
  errorMatcher = new MyErrorStateMatcher();

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
          console.error('Error en el inicio de sesión:', response.message);
          this.authHttpService.logout().subscribe(() => {
            // Limpiar sesión en caso de error
            console.log('Sesión limpia');
          });
        }
      },
      error: (error) => {
        console.error('Error en la solicitud de login:', error);
        this.authHttpService.logout().subscribe(() => {
          // Limpiar sesión en caso de error
          console.log('Sesión limpia');
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  onPasswordInput() {
    this.passwordEntered = this.loginForm.get('password')?.value.trim().length > 0;
  }
}
