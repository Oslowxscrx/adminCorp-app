import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Area } from '../../../interface/area/area';
import { AreaService } from '../../../service/area.service';
import { ModalService } from '../../../service/modal/modal.service';

@Component({
  selector: 'app-area-modal',
  imports: [ ReactiveFormsModule,],
  templateUrl: './area-modal.component.html',
  styleUrl: './area-modal.component.css'
  
})
export class AreaModalComponent implements OnInit {
  currentArea = {} as Area;
  title = 'Nueva Area';
  hide: boolean = true;
  paramsSubscription!: Subscription;
  loading: boolean = true;
  passwordEntered: boolean = false;
  button: boolean = true;
  // Variables de clase que son inyectadas por referencia
  // matcher = new MyErrorStateMatcher();
  public formGroup!: FormGroup;
  constructor(
    private _areaService: AreaService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _dialogRef: MatDialogRef<AreaModalComponent>,
    private modalCommunicationService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: { areaId: number },
    public dialogRef: MatDialogRef<AreaModalComponent>,
  ) { 
    this.initForm(); 
  }
  ngOnInit(): void {
    if (this.data && this.data.areaId) {
      this.title = 'Editar Area'
      this.button = false;
      // Llama a un servicio para obtener la información del usuario por ID
      this.getAreaById(this.data.areaId);
    } else {
      // Manejo adicional si no se proporciona un ID
      this.button = true;
    }
    this.modalCommunicationService.closeModal$.subscribe(() => {
      this._dialogRef.close();
    });
  }


  initForm() {
    this.formGroup = this._formBuilder.group({
      id:[0],
      nombreArea: ['', [Validators.required, Validators.maxLength(16)]],
      descripcionArea: ['', [ Validators.maxLength(56)]],
    }
  );

    this.formGroup.valueChanges.subscribe((val) => {
      this.currentArea = val;
      console.log(val);
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  getAreaById(id: number) {
    this.loading = true;
    this._areaService.getAreaById(id).subscribe({
      next: (response: Area) => {
        this.handleResponse(response);
      },
      error: (error) => {
        this.handleError(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private handleResponse(response: any): void {
    this.currentArea = response;
    this.formGroup.patchValue(this.currentArea);
    this.loading = false;
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      console.error("Error al obtener areas:", error.error.message);
      this.currentArea = error.error.data
    }
    this.loading = false;
  }

  public createArea() {
    this._areaService.createArea(this.currentArea).subscribe((res: any) => {
      console.log(this.currentArea);
      window.location.reload();
    });
  }

  public updateArea() {
    this._areaService.updateArea(this.currentArea).subscribe((res: any) => {
      console.log('update',this.currentArea);
      window.location.reload();
    });
  }

  closeModal() {
    this.modalCommunicationService.close();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      if (!this.currentArea.id) {
        this.createArea();
        console.log('entraaa crear')
        this.modalCommunicationService.close();
      } else {
        this.updateArea();
        console.log('entraaa editar')
        this.modalCommunicationService.close();
      }
    }
  }

  public onSubmitUpdate(): void {
      this.updateArea();
      console.log('entraaa crear')
      this.modalCommunicationService.close();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
}
