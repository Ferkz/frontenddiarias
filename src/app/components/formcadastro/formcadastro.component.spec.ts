import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcadastroComponent } from './formcadastro.component';

describe('FormcadastroComponent', () => {
  let component: FormcadastroComponent;
  let fixture: ComponentFixture<FormcadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormcadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormcadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
