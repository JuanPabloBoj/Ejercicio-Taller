import { Cita, EstadoCita } from "../models/Cita";

export class CitasService {
  private citas: Cita[] = [];

  async listar(): Promise<Cita[]> {
    return this.citas;
  }

  async buscar(id: number): Promise<Cita | undefined> {
    return this.citas.find(c => c.id === id);
  }

  async crear(cita: Cita): Promise<void> {
    const existeDuplicada = this.citas.some(
      c => c.medicoId === cita.medicoId && 
           c.fechaHoraInicio === cita.fechaHoraInicio && 
           c.estado !== "CANCELADA"
    );

    if (existeDuplicada) {
      throw new Error("El médico ya tiene una cita agendada en esa fecha y hora de inicio");
    }

    cita.estado = cita.estado ?? "PENDIENTE";
    this.citas.push(cita);
  }

  async actualizar(cita: Cita): Promise<void> {
    const index = this.citas.findIndex(c => c.id === cita.id);
    if (index === -1) {
      throw new Error("Cita no encontrada");
    }
    this.citas[index] = cita;
  }

  async eliminar(id: number): Promise<void> {
    this.citas = this.citas.filter(c => c.id !== id);
  }

  async confirmarCita(id: number): Promise<void> {
    const cita = await this.buscar(id);
    if (!cita) {
      throw new Error("Cita no encontrada");
    }
    cita.estado = "CONFIRMADA";
  }

  async reprogramarCita(id: number, nuevaFechaHoraInicio: string, nuevaFechaHoraFinal: string): Promise<void> {
    const cita = await this.buscar(id);
    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    const ocupado = this.citas.some(
      c => c.medicoId === cita.medicoId && 
           c.fechaHoraInicio === nuevaFechaHoraInicio && 
           c.id !== id && 
           c.estado !== "CANCELADA"
    );

    if (ocupado) {
      throw new Error("El horario seleccionado no está disponible");
    }

    cita.fechaHoraInicio = nuevaFechaHoraInicio;
    cita.fechaHoraFinal = nuevaFechaHoraFinal;
    cita.estado = "PENDIENTE";
  }

  async reportePorMedico(medicoId: number): Promise<Cita[]> {
    return this.citas.filter(c => c.medicoId === medicoId);
  }

  async reportePorEspecialidad(especialidad: string): Promise<Cita[]> {
    return this.citas.filter(c => c.especialidad.toLowerCase() === especialidad.toLowerCase());
  }

  async reporteInasistencias(): Promise<Cita[]> {
    return this.citas.filter(c => c.estado === "INASISTENCIA");
  }
}