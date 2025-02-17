import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-ts'; // Importa AES y enc de crypto-ts

@Injectable({
  providedIn: 'root'
})
export class EncryptionHttpService {

  private key = enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
  private iv = enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

  encrypt(data: string): string {
    const cipherText = AES.encrypt(data, this.key, { iv: this.iv }).toString(); // Usamos AES.encrypt
    return cipherText;
  }

  decrypt(encryptedData: string): string {
    const bytes = AES.decrypt(encryptedData, this.key, {
      iv: this.iv,
    });
    const plaintext = bytes.toString(enc.Utf8); // Usamos enc.Utf8
    return plaintext;
  }
}