import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionesPasajeroComponent } from './obligaciones-pasajero.component';

describe('ObligacionesPasajeroComponent', () => {
  let component: ObligacionesPasajeroComponent;
  let fixture: ComponentFixture<ObligacionesPasajeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligacionesPasajeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionesPasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
