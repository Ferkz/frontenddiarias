import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/diaria';

  constructor(private http: HttpClient) { }
  criarDiaria(
    paciente:any):Observable<void>{
      return this.http.post<void>(`${this.apiUrl}/cria-diaria`, paciente);
    }
  getAllDiarias():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/lista-diaria`);
    }
  }
