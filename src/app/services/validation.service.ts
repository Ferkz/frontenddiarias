import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidationService {
  hasError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return !!(control?.hasError(error) && control.touched);
  }

  getErrorMessage(form: FormGroup, field: string): string | null {
    if (this.hasError(form, field, 'required')) return 'Campo obrigatório.';
    if (this.hasError(form, field, 'minlength')) {
      return `Insira no mínimo ${form.get(field)?.errors?.['minlength'].requiredLength} caracteres.`;
    }
    if (this.hasError(form, field, 'maxlength')) {
      return `Insira no máximo ${form.get(field)?.errors?.['maxlength'].requiredLength} caracteres.`;
    }
    if (this.hasError(form, field, 'pattern')) return 'Formato inválido.';
    if (this.hasError(form, field, 'email')) return 'Email inválido';
    return null;
  }
}
