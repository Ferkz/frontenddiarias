import { Paciente } from './../../interfaces/paciente';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowMessageComponent } from '../show-message/show-message.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-formcadastro',
  templateUrl: './formcadastro.component.html',
  styleUrls: ['./formcadastro.component.scss'],
})
export class FormcadastroComponent implements OnInit {
  durationInSeconds = 5;
  buildForm!: FormGroup;
  cadastroPaciente!: Paciente;

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {}
  showMessage(message: string, type: 'success' | 'error') {
    this._snackBar.openFromComponent(ShowMessageComponent, {
      data: { message, type },
      duration: this.durationInSeconds * 1000,
    });
  }
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
    } else if (this.hasError(field, 'email')) {
      return 'Email inválido';
    }
    return null;
  }
  getClass(field: string): string {
    const control = this.buildForm.get(field);
    return control?.errors && control.touched ? ' alert-danger' : '';
  }

  ngOnInit(): void {
    this.buildForm = this.fb.group({
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern(
            /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*(-[A-Za-zÀ-ÖØ-öø-ÿ]+)?$/
          ),
        ]),
      ],
      numeroProntuario: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
          Validators.pattern(/^\d{1,13}$/),
        ]),
      ],
      tipoAlta: ['', Validators.compose([Validators.minLength(5)])],
      dataEntrada: [
        '',
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      dataSaida: [
        '',
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      horaEntrada: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
          Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        ]),
      ],
      horaSaida: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
          Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        ]),
      ],
    });
  }
  parseDate(data:any){
    const [ano, mes, dia] = data.split('-')
    const newDate = new Date(ano,mes-1, dia)
    return newDate.getTime()
  }
  parseDateToString (data:any){
    const [ano, mes, dia] = data.split('-')
    const dataFormat = `${dia}/${mes}/${ano}`
    return dataFormat
  }

  onSubmit() {
    if (this.buildForm.valid) {
      const dataEntradaStr = this.buildForm.get('dataEntrada')?.value;
      const dataSaidaStr = this.buildForm.get('dataSaida')?.value;
      const dataEntrada= this.parseDateToString(dataEntradaStr)
      const dataSaida = this.parseDateToString(dataSaidaStr)
      this.cadastroPaciente = {
        nome: this.buildForm.get('nome')?.value,
        numeroProntuario: this.buildForm.get('numeroProntuario')?.value,
        tipoAlta: this.buildForm.get('tipoAlta')?.value,
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        horaEntrada: this.buildForm.get('horaEntrada')?.value,
        horaSaida: this.buildForm.get('horaSaida')?.value,
      }
      console.log(this.cadastroPaciente);
      this.generatePdf(this.cadastroPaciente);
    }
  }
  generatePdf(paciente: any) {
    const data = paciente;
    this.http
      .post('http://localhost:8080/diaria/cria-diaria', data, {
        responseType: 'blob',
      })
      .subscribe({
        next: (response) => {
          this.showMessage('Diária calculada com sucesso!', 'success');
        },
        error: () => {
          this.showMessage('Falha ao calcular diária!', 'error');
        },
      });
  }
}
