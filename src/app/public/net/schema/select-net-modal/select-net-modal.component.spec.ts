import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNetModalComponent } from './select-net-modal.component';

describe('SelectNetModalComponent', () => {
  let component: SelectNetModalComponent;
  let fixture: ComponentFixture<SelectNetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectNetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
