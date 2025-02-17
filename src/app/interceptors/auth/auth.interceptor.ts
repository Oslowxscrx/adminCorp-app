import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthSessionStorage } from '../../auth/validator/auth-session-storage';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authHttpService: AuthService,
    private authSessionStorage: AuthSessionStorage
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = this.addToken(request, this.authSessionStorage.getAccessToken());

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Aquí deberías implementar la lógica para volver a solicitar las credenciales del usuario
    // y obtener un nuevo token de acceso
    const newToken = 'tu_nuevo_token_de_acceso';

    // Actualizar el token en el almacenamiento
    this.authSessionStorage.setAccessToken(newToken);

    // Reintentar la solicitud original con el nuevo token
    request = this.addToken(request, newToken);
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}