// import { Injectable } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
// import { EncryptionHttpService } from '../../../app/service/encryption/encryption-http.service';

// const SESSION_STORAGE_TOKEN_ACCESS_KEY = 'access_token';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthCookieStorage {
//   constructor(
//     private cookieService: CookieService,
//     private encryptionHttpService: EncryptionHttpService
//   ) {}

//   setAccessToken(token: string): void {
//     const encryptedToken = this.encryptionHttpService.encrypt(token);
//     this.cookieService.set(
//       SESSION_STORAGE_TOKEN_ACCESS_KEY,
//       encryptedToken,
//       { expires: 1, path: '/' } // Utiliza la opción 'expires' para configurar la expiración
//     );
//   }

//   getAccessToken(): string {
//     const encryptedToken = this.cookieService.get(
//       SESSION_STORAGE_TOKEN_ACCESS_KEY
//     );
//     return encryptedToken ? this.encryptionHttpService.decrypt(encryptedToken) : '';
//   }

//   removeAccessToken(): void {
//     this.cookieService.delete(SESSION_STORAGE_TOKEN_ACCESS_KEY, '/');
//   }
// }