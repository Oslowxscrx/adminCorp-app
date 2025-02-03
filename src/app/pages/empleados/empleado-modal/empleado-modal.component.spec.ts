import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoModalComponent } from './empleado-modal.component';

describe('EmpleadoModalComponent', () => {
  let component: EmpleadoModalComponent;
  let fixture: ComponentFixture<EmpleadoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
