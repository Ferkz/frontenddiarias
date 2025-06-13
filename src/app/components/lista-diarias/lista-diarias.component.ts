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

  // 1. ADICIONAR 'competencia' À LISTA DE COLUNAS
  displayedColumns: string[] = [
    'id',
    'nome',
    'numeroProntuario',
    'tipoAlta',
    'competencia', // <--- COLUNA ADICIONADA
    'visualizar',
    'alterar',
    'excluir',
  ];

  durationInSeconds = 10;
  searchName: string = '';
  competenciaSelecionada: string = '';
  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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

      // 2. ATUALIZAR O FILTRO PARA ACEITAR MÚLTIPLOS CRITÉRIOS
      this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
        const searchTerms = JSON.parse(filter);

        // Converte tudo para minúsculas para uma comparação sem case-sensitive
        const nomeMatch = data.nome.toLowerCase().includes(searchTerms.nome);
        const competenciaMatch = searchTerms.competencia ? data.competencia.toLowerCase() === searchTerms.competencia.toLowerCase() : true;

        return nomeMatch && competenciaMatch;
      };
    });
  }

  // 3. CRIAR UMA ÚNICA FUNÇÃO PARA APLICAR AMBOS OS FILTROS
  applyCombinedFilter() {
    const filterValue = {
      nome: this.searchName.trim().toLowerCase(),
      competencia: this.competenciaSelecionada
    };
    this.dataSource.filter = JSON.stringify(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // O restante dos seus métodos (viewPdf, showMessage, deleteDiaria, exportarXLS) continua igual...

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

  exportarXLS() {
    if (!this.competenciaSelecionada) {
      this.showMessage('Por favor, selecione uma competência para exportar.', 'error', null);
      return;
    }
    this.pacienteService.downloadXlsxByCompetencia(this.competenciaSelecionada.toLowerCase()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pacientes_${this.competenciaSelecionada.toLowerCase()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.showMessage('Erro ao exportar o arquivo. Verifique se há dados para a competência selecionada.', 'error', null);
        console.error(err);
      }
    });
  }
}
