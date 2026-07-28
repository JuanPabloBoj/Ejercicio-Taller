import { Horario } from "../models/Horario";

export class HorariosService {
  private horarios: Horario[] = [];

  async listar(): Promise<Horario[]> {
    return this.horarios;
  }

  async buscar(id: string): Promise<Horario | undefined> {
    return this.horarios.find(h => h.id === id);
  }

  async crear(horario: Horario): Promise<void> {
    this.horarios.push(horario);
  }

  async actualizar(horario: Horario): Promise<void> {
    const index = this.horarios.findIndex(h => h.id === horario.id);
    if (index === -1) {
      throw new Error("Horario no encontrado");
    }
    this.horarios[index] = horario;
  }

  async eliminar(id: string): Promise<void> {
    this.horarios = this.horarios.filter(h => h.id !== id);
  }

  async obtenerDisponibles(medicoId: number, fecha: string): Promise<Horario[]> {
    return this.horarios.filter(h => h.medicoId === medicoId);
  }
}