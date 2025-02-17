import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProyectosComponent } from './modal-proyectos.component';

describe('ModalProyectosComponent', () => {
  let component: ModalProyectosComponent;
  let fixture: ComponentFixture<ModalProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProyectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
