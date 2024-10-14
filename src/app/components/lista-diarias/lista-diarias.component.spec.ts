import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDiariasComponent } from './lista-diarias.component';

describe('ListaDiariasComponent', () => {
  let component: ListaDiariasComponent;
  let fixture: ComponentFixture<ListaDiariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDiariasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDiariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
