import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaViajesVueltaComponent } from './lista-viajes-vuelta.component';

describe('ListaViajesVueltaComponent', () => {
  let component: ListaViajesVueltaComponent;
  let fixture: ComponentFixture<ListaViajesVueltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaViajesVueltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaViajesVueltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
