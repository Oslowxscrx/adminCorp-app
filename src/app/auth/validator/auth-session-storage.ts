import { Injectable } from '@angular/core';
import { EncryptionHttpService } from '../../service/encryption/encryption-http.service';

const SESSION_STORAGE_TOKEN_ACCESS_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionStorage {
  constructor(
    private encryptionHttpService: EncryptionHttpService,
  ) {}

  setAccessToken(token: string): void {
    const encryptedToken = this.encryptionHttpService.encrypt(token);
    sessionStorage.setItem(SESSION_STORAGE_TOKEN_ACCESS_KEY, encryptedToken);
  }

  getAccessToken(): string {
    const encryptedToken = sessionStorage.getItem(SESSION_STORAGE_TOKEN_ACCESS_KEY);
    return encryptedToken ? this.decryptedToken(encryptedToken) : '';
  }

  removeAccessToken(): void {
    sessionStorage.clear();
  }

  private decryptedToken(encryptedToken: string): string {
    try {
      return this.encryptionHttpService.decrypt(encryptedToken);
    } catch (error) {
      console.error('Error al desencriptar el token de acceso:', error);
      return '';
    }
  }

  public clearAccessToken(): void {
    sessionStorage.removeItem(SESSION_STORAGE_TOKEN_ACCESS_KEY);
  }
}