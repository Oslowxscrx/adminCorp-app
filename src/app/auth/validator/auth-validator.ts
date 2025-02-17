import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthTokenDecoder } from './auth-token-decoder';

@Injectable({
  providedIn: 'root',
})
export class AuthValidator {
  private jwtHelper = new JwtHelperService();

  constructor(
    private authTokenDecoder: AuthTokenDecoder
  ) {}

  isTokenValid(token: string): boolean {
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  hasPermission(token: string, permissions: string[]): boolean {
    if (!this.isTokenValid(token)) {
      return false;
    }

    const decodedToken = this.authTokenDecoder.decodeToken(token);
    const permissionsUser = decodedToken?.permissions;

    if (permissionsUser && permissions) {
      return permissionsUser.some((permission: string) =>
        permissions.includes(permission)
      );
    }

    return false;
  }
}