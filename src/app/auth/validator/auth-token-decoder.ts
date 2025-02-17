import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenDecoder {
  private jwtHelper = new JwtHelperService();

  constructor() {}

  decodeToken(token: string): any {
    if (!token) {
      console.error('Token no proporcionado');
      return null;
    }

    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        console.error('Token expirado');
        return null;
      }

      return this.jwtHelper.decodeToken(token);
    } catch (err) {
      console.error('Error al decodificar el token:', err);
      return null;
    }
  }
}