import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interface/auth';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interface/usuarios/usuarios';
import { environment } from '../../enviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthSessionStorage } from '../auth/validator/auth-session-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL + '/auth';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private authSessionStorage: AuthSessionStorage
  ) {}

  isAuthenticated(): boolean {
    const token = this.authSessionStorage.getAccessToken();
    console.log(token, 'token');
    return token !== '';
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(
      `${this.API_URL}/register`,
      user,
      this.httpOptions
    );
  }

  login(userName: string, password: string): Observable<AuthResponse> {
    const loginRequest = { userName, password };
    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/login`,
        loginRequest,
        this.httpOptions
      )
      .pipe(
        map((response) => {
          if (response.success && response.token) {
            console.log('entra', response.token, response.success);
            this.authSessionStorage.setAccessToken(response.token);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error en la solicitud de login:', error);
          return of({
            success: false,
            message: 'Error en la solicitud de login.',
          });
        })
      );
  }

  logout(): Observable<boolean> {
    this.authSessionStorage.clearAccessToken();
    return of(true);
  }

  public deleteUserById(userId: number): Observable<User> {
    return this.http.delete<User>(
      `${this.API_URL}/${userId}`,
      this.httpOptions
    );
  }
}
