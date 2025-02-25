import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaModalDeleteComponent } from './area-modal-delete.component';

describe('AreaModalDeleteComponent', () => {
  let component: AreaModalDeleteComponent;
  let fixture: ComponentFixture<AreaModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaModalDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
