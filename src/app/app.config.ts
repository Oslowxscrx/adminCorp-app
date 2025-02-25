import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideHttpClient,
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Agregar soporte para interceptores
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Interceptor de Auth
    CommonModule,
  ],
};
