import { Component, Inject } from '@angular/core';
import { ModalService } from '../../../service/modal/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-empleado-modal-delete',
  templateUrl: './empleado-modal-delete.component.html',
  styleUrls: ['./empleado-modal-delete.component.css'],
})
export class EmpleadoModalDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EmpleadoModalDeleteComponent>,
    private modalCommunicationService: ModalService
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
  closeModal() {
    this.modalCommunicationService.close();
  }
}
