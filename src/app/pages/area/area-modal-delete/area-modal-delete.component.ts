import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../service/modal/modal.service';
@Component({
  selector: 'app-area-modal-delete',
  imports: [],
  templateUrl: './area-modal-delete.component.html',
  styleUrl: './area-modal-delete.component.css'
})
export class AreaModalDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AreaModalDeleteComponent>,
    private modalCommunicationService: ModalService
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
  closeModal() {
    this.modalCommunicationService.close();
  }
}
