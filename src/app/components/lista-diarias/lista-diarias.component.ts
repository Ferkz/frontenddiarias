import { HttpClient } from '@angular/common/http';
import { PacienteService } from './../../services/paciente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/interfaces/paciente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-lista-diarias',
  templateUrl: './lista-diarias.component.html',
  styleUrls: ['./lista-diarias.component.scss']
})
export class ListaDiariasComponent implements OnInit {
  dataSource = new MatTableDataSource<Paciente>();
  displayedColumns: string[] = ['id', 'nome', 'numeroProntuario', 'tipoAlta','visualizar'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pacienteService: PacienteService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPdfs();
  }
  loadPdfs() {
    this.pacienteService.getAllDiarias().subscribe((data) => {
      this.dataSource.data = data
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  viewPdf(diariaid: number){
    this.pacienteService.getPdfById(diariaid).subscribe(response =>{
})
    this.pacienteService.getPdfById(diariaid).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
}
