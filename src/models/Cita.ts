export type EstadoCita = "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA" | "INASISTENCIA";

export interface Cita{
    id: number,
    pacienteId: number,
    medicoId: number,
    especialidad: string,
    fechaHoraInicio: string,
    fechaHoraFinal: string,
    estado: EstadoCita,
    causasConsulta: string,
    monto: number,
    motivoCancelarion?: string
}