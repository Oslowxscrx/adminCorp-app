import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../service/modal/modal.service';

@Component({
  selector: 'app-actividades-modal-delete',
  templateUrl: './actividades-modal-delete.component.html',
  styleUrls: ['./actividades-modal-delete.component.css'],
})
export class ActividadesModalDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActividadesModalDeleteComponent>,
    private modalCommunicationService: ModalService
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
  closeModal() {
    this.modalCommunicationService.close();
  }
}
