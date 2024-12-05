import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DiariaCalculatorService {
  parseDateToString(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  dateToTime(date: string): number {
    const [year, month, day] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
  }

  calculateDays(dataEntrada: string, dataSaida: string, tipoAlta: string): number {
    const timeDifference = (this.dateToTime(dataSaida) - this.dateToTime(dataEntrada)) / (24 * 60 * 60 * 1000);
    return tipoAlta === "Óbito" || tipoAlta === "Transferência" ? Math.floor(timeDifference) + 1 : Math.floor(timeDifference);
  }

  calculateTotalValue(days: number): number {
    const parametros = JSON.parse(localStorage.getItem('parametros') || '{}');
    const dailyRate = parseFloat(parametros.valor.replace('.', '').replace(',', '.'));
    return dailyRate * days;
  }
}
