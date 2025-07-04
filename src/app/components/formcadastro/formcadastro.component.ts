import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowMessageComponent } from '../show-message/show-message.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';
import { Paciente } from 'src/app/interfaces/paciente';

@Component({
  selector: 'app-formcadastro',
  templateUrl: './formcadastro.component.html',
  styleUrls: ['./formcadastro.component.scss'],
})
export class FormcadastroComponent implements OnInit {
  durationInSeconds = 10;
  buildForm!: FormGroup;
  cadastroPaciente!: Paciente;

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {}

  showMessage(message: string, type: 'success' | 'error', id: any) {
    this._snackBar.openFromComponent(ShowMessageComponent, {
      data: { message, type, id },
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
    return control?.errors && control.touched ? 'alert alert-danger' : '';
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
      numeroAih: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+$/)
        ])
      ],
      tipoAlta: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
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
      competencia: ['', Validators.required]
    });
  }

  parseDateToString(data: any) {
    const [ano, mes, dia] = data.split('-');
    const dataFormat = `${dia}/${mes}/${ano}`;
    return dataFormat;
  }

  dateToTime(date: any) {
    const [ano, mm, dd] = date.split('-');
    const newDate = new Date(ano, mm - 1, dd);
    return newDate.getTime();
  }

  formataMoeda(days: number) {
    const parametros = JSON.parse(localStorage.getItem('parametros') || '{}');
    const valorDiario = parametros.valor.replace('.', '').replace(',', '.');
    return valorDiario * days;
  }

  formataValor(valor: any) {
    const valorFormatado = Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
    return valorFormatado;
  }

  onSubmit() {
    if (this.buildForm.valid) {
      const dataEntradaStr = this.buildForm.get('dataEntrada')?.value;
      const dataSaidaStr = this.buildForm.get('dataSaida')?.value;
      const dataEntrada = this.parseDateToString(dataEntradaStr);
      const dataSaida = this.parseDateToString(dataSaidaStr);
      const time =
        (this.dateToTime(dataSaidaStr) - this.dateToTime(dataEntradaStr)) /
        1000;
      const daysToSecond = 24 * 60 * 60;
      let days = Math.floor(time / daysToSecond);
      const pegaTipoAlta = this.buildForm.get('tipoAlta')?.value;
      if (pegaTipoAlta === 'Óbito' || pegaTipoAlta === 'Transferência') {
        days += 1;
      }
      const pegaValor = JSON.parse(localStorage.getItem('parametros') || '{}');
      var valorFormatado = pegaValor;
      try {
        valorFormatado = pegaValor.valor.replace('.', '').replace(',', '.');
      } catch (error) {
        return this.showMessage('O valor da diária não pode está vazio.','error', null)
      }

      this.cadastroPaciente = {
        nome: this.buildForm.get('nome')?.value,
        numeroProntuario: this.buildForm.get('numeroProntuario')?.value,
        numeroAih: this.buildForm.get('numeroAih')?.value,
        tipoAlta: this.buildForm.get('tipoAlta')?.value,
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        horaEntrada: this.buildForm.get('horaEntrada')?.value,
        horaSaida: this.buildForm.get('horaSaida')?.value,
        diasInternado: days,
        valorDiario: this.formataValor(valorFormatado),
        valorTotal: this.formataValor(this.formataMoeda(days)),
        competencia: this.buildForm.get('competencia')?.value,
      };

      console.log(this.cadastroPaciente);
      this.generatePdf(this.cadastroPaciente);
    }
  }

  generatePdf(paciente: any) {
    this.pacienteService.insertDiaria(paciente).subscribe({
      next: () => {
        this.pacienteService.getLastId().subscribe((id) => {
          console.log(`ID da diariia ${id}`);
          this.showMessage('Diária calculada com sucesso!', 'success', id);
        });
      },
      error: () => {
        this.showMessage('Falha ao calcular diária!', 'error', null);
      },
    });
  }
}
