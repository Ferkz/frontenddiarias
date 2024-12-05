
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://10.0.0.71:8080/diaria';

  constructor(private http: HttpClient) { }
  insertDiaria(
    paciente:any):Observable<void>{
      return this.http.post<void>(`${this.apiUrl}/cria-diaria`, paciente);
    }
  getAllDiarias():Observable<any[]>{
    return this.http.get<Paciente[]>(`${this.apiUrl}/lista-diaria`);
    }
  getPdfById(id: number): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/visualizar/${id}`, { responseType: 'blob' });
    }
  }


