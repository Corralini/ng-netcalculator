import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketTracerModalComponent } from './packet-tracer-modal.component';

describe('PacketTracerModalComponent', () => {
  let component: PacketTracerModalComponent;
  let fixture: ComponentFixture<PacketTracerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacketTracerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketTracerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
