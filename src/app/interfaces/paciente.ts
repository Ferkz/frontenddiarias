export interface Paciente {
    nome: string,
    numeroProntuario: number
    tipoAlta?: string,
    dataEntrada?: string | null,
    dataSaida?:  string | null,
    horaEntrada:string,
    horaSaida: string,
    diasInternado: number,
    valorDiario: string,
    valorTotal: string,
}
