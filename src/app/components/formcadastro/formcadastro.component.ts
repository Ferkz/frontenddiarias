import { PacienteService } from './../../services/paciente.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowMessageComponent } from '../show-message/show-message.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-formcadastro',
  templateUrl: './formcadastro.component.html',
  styleUrls: ['./formcadastro.component.scss']
})
export class FormcadastroComponent implements OnInit {
  durationInSeconds = 5;
  paciente = {
    nome: '',
    numeroProntuario: 0,
    tipoAlta: '',
    dataEntrada: '',
    dataSaida: '',
    horaEntrada: '',
    horaSaida: ''
  };

  constructor(private _snackBar: MatSnackBar, private pacienteService: PacienteService) { }

  showMessage(message: string, type: 'success' | 'error'){
    this._snackBar.openFromComponent(ShowMessageComponent, {
      data: { message, type },
      duration: this.durationInSeconds * 1000

    })
  }
  generatePdf() {
    this.pacienteService.criarDiaria(this.paciente).subscribe
    ({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `${this.paciente.nome}.pdf`);
        this.showMessage('Diária calculada com sucesso!', 'success')
      },
      error: (error) => {
        console.error('Erro ao gerar PDF', error);
        this.showMessage('Falha ao calcular diária!', 'error')
      }
    });

  }
  ngOnInit(): void {
  }

}
