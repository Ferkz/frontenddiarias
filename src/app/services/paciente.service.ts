import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl =`${environment.apiUrl}/diaria`

  constructor(private http: HttpClient) {}
  insertDiaria(paciente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cria-diaria`, paciente);
  }
  getAllDiarias(): Observable<any[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/lista-diaria`);
  }
  getPdfById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/visualizar/${id}`, {
      responseType: 'blob',
    });
  }
  deleteDiariaById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getLastId(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pegarid`);
  }
  downloadXlsxByCompetencia(competencia: string): Observable<Blob> {
  const url = `${this.apiUrl}/download-xlsx?competencia=${competencia}`;
  return this.http.get(url, {
    responseType: 'blob'
  });
}
}
