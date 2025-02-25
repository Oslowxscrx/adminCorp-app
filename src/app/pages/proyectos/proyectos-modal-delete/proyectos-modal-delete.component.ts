import { Component, Inject } from '@angular/core';
import { ModalService } from '../../../service/modal/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-proyectos-modal-delete',
  templateUrl: './proyectos-modal-delete.component.html',
  styleUrls: ['./proyectos-modal-delete.component.css'],
})
export class ProyectosModalDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProyectosModalDeleteComponent>,
    private modalCommunicationService: ModalService
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
  closeModal() {
    this.modalCommunicationService.close();
  }
}
