import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/api/patient';


  constructor(private http: HttpClient) { }
  criarDiaria(
    paciente:
     {nome: string,
      numeroProntuario: number,
      tipoAlta: string,
      dataEntrada: string,
      dataSaida: string,
      horaEntrada: string,
    horaSaida: string }){
      return this.http.post(`${this.apiUrl}/generate-pdf`, paciente, {
        responseType: 'blob' // Para garantir que recebemos um PDF
      })

    }
  }
