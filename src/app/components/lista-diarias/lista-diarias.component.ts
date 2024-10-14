import { HttpClient } from '@angular/common/http';
import { PacienteService } from './../../services/paciente.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/interfaces/paciente';

@Component({
  selector: 'app-lista-diarias',
  templateUrl: './lista-diarias.component.html',
  styleUrls: ['./lista-diarias.component.scss']
})
export class ListaDiariasComponent implements OnInit {
//  pdfs: any[] = [];
  dataSource = new MatTableDataSource<Paciente>();
  displayedColumns: string[] = ['id', 'nome', 'numeroProntuario', 'tipoAlta','visualizar'];

  constructor(private pacienteService: PacienteService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPdfs();
  }
  loadPdfs() {
    this.pacienteService.getAllDiarias().subscribe((data) => {
      this.dataSource.data = data
    });
  }
  visualizarPdf(diariaid: number){
    this.http.get(`http://localhost:8080/diaria/visualizar/${diariaid}`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }

}
