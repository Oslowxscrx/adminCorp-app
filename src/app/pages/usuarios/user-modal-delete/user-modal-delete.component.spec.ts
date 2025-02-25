import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalDeleteComponent } from './user-modal-delete.component';

describe('UserModalDeleteComponent', () => {
  let component: UserModalDeleteComponent;
  let fixture: ComponentFixture<UserModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModalDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
