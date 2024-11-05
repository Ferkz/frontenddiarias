import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parametros } from 'src/app/interfaces/parametros';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  buildForm! : FormGroup
  cadastroParametros! : Parametros
  constructor(private fb: FormBuilder) { }

  hasError(field: string, error: string): boolean {
    const control = this.buildForm.get(field);
    return !!(control?.hasError(error) && control.touched);
  }
  getErrorMessage(field: string): string | null {
    if (this.hasError(field, 'required')) {
      return 'Campo obrigatório.';
    } else if (this.hasError(field, 'minlength')) {
      return `Insira no mínimo ${
        this.buildForm.get(field)?.errors?.['minlength'].requiredLength
      } caracteres.`;
    } else if (this.hasError(field, 'maxlength')) {
      return `Insira no máximo ${
        this.buildForm.get(field)?.errors?.['maxlength'].requiredLength
      } caracteres.`;
    } else if (this.hasError(field, 'pattern')) {
      return 'Formato inválido.';
    }
    return null;
  }
  getClass(field: string): string {
    const control = this.buildForm.get(field);
    return control?.errors && control.touched ? ' alert-danger' : '';
  }
  ngOnInit(): void {
    const parametros = JSON.parse(localStorage.getItem('parametros') || '{}');
    this.buildForm = this.fb.group({
      valor: [parametros.valor,Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[1-9]\d{0,2}(\.\d{3})*,\d{2}$/)
      ]),
    ],
    cidade: [parametros.cidade, Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.pattern( /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*(-[A-Za-zÀ-ÖØ-öø-ÿ]+)?$/)
    ])]

    })
  }
  onSubmit(){
    this.cadastroParametros = {
      valor: this.buildForm.get('valor')?.value,
      cidade: this.buildForm.get('cidade')?.value
    }
    localStorage.setItem('parametros', JSON.stringify(this.cadastroParametros))
    const getParametros = localStorage.getItem('parametros')
    console.log(getParametros);
    this

  }

}


