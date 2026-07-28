type Dias = "Lunes" | "Martes"| "Miercoles" | "Jueves" | "Viernes" | "Sabado" | "Domingo";

export interface Horario {
    id:string,
    medicoId: number,
    diaSemana: Dias,
    horaInicio: string,
    horaFinalizar: string,
    duracionConsultaMinutos: number,
    asistio?: boolean,
    fechaRemplazo?: string
}