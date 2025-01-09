import { Paciente } from './../../interfaces/paciente';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { PacienteService } from 'src/app/services/paciente.service';


@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.scss']
})
export class ShowMessageComponent implements OnInit {

  constructor( private pacienteService: PacienteService, @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }
  imprimirDiaria(): void {
    const id = this.data.id; // Recupera o ID enviado
    console.log('Oiiiiiiiii'+this.data.id);

    if (id) {
      this.pacienteService.getPdfById(id).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    }
  }
}

