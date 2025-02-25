import { Component, Inject } from '@angular/core';
import { ModalService } from '../../../service/modal/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal-delete',
  templateUrl: './user-modal-delete.component.html',
  styleUrls: ['./user-modal-delete.component.css'],
})
export class UserModalDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserModalDeleteComponent>,
    private modalCommunicationService: ModalService
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
  closeModal() {
    this.modalCommunicationService.close();
  }
}
