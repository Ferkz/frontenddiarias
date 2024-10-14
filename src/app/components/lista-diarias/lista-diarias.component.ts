import { HttpClient } from '@angular/common/http';
import { PacienteService } from './../../services/paciente.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-diarias',
  templateUrl: './lista-diarias.component.html',
  styleUrls: ['./lista-diarias.component.scss']
})
export class ListaDiariasComponent implements OnInit {
  pdfs: any[] = [];

  constructor(private pacienteService: PacienteService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPdfs();
  }
  loadPdfs() {
    this.pacienteService.getAllDiarias().subscribe((data) => {
      this.pdfs = data;
    });
  }
  downloadPdf(pdf: any) {
    const blob = new Blob([pdf.pdfData], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient_report_${pdf.id}.pdf`;
    a.click();
  }
  visualizarPdf(diariaid: number){
    this.http.get(`http://localhost:8080/diaria/visualizar/${diariaid}`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }

}
