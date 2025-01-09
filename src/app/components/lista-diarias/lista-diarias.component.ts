import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PacienteService } from './../../services/paciente.service';
import { ShowMessageComponent } from '../show-message/show-message.component';
import { Paciente } from 'src/app/interfaces/paciente';

@Component({
  selector: 'app-lista-diarias',
  templateUrl: './lista-diarias.component.html',
  styleUrls: ['./lista-diarias.component.scss'],
})
export class ListaDiariasComponent implements OnInit {
  dataSource = new MatTableDataSource<Paciente>();
  displayedColumns: string[] = [
    'id',
    'nome',
    'numeroProntuario',
    'tipoAlta',
    'visualizar',
    'alterar',
    'excluir',
  ];
  durationInSeconds = 10;
  searchName: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pacienteService: PacienteService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs() {
    this.pacienteService.getAllDiarias().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Configura a função de filtro
      this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
        return data.nome.toLowerCase().includes(filter);
      };
    });
  }
  applyFilter() {
    this.dataSource.filter = this.searchName.trim().toLowerCase();
  }
  viewPdf(diariaid: number) {
    this.pacienteService.getPdfById(diariaid).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  showMessage(message: string, type: 'success' | 'error', id: any) {
    this._snackBar.openFromComponent(ShowMessageComponent, {
      data: { message, type, id },
      duration: this.durationInSeconds * 1000,
    });
  }
  deleteDiaria(id: number) {
    this.pacienteService.deleteDiariaById(id).subscribe({
      next: () => {
        this.showMessage('Diária deletada com sucesso!', 'success', null);
        this.loadPdfs();
      },
      error: () => {
        this.showMessage('Erro ao deletar diária!', 'error', null);
      },
    });
  }
}
