import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private closeModalSubject = new Subject<void>();

  closeModal$ = this.closeModalSubject.asObservable();

  close() {
    this.closeModalSubject.next();
  }
}
