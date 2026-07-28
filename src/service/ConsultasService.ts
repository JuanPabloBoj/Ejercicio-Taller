import { Consulta } from "../models/Consulta";
import { CitasService } from "./CitasService";

export class ConsultasService {
  private consultas: Consulta[] = [];
  private citasService: CitasService;

  constructor(citasService: CitasService) {
    this.citasService = citasService;
  }

  async listar(): Promise<Consulta[]> {
    return this.consultas;
  }

  async buscar(id: string): Promise<Consulta | undefined> {
    return this.consultas.find(c => c.id === id);
  }

  async crear(consulta: Consulta): Promise<void> {
    const cita = await this.citasService.buscar(consulta.citaId);

    if (!cita) {
      throw new Error("La cita asociada no existe");
    }

    if (cita.estado !== "CONFIRMADA") {
      throw new Error("Solo se pueden atender y registrar consultas de citas confirmadas");
    }

    cita.estado = "COMPLETADA";
    this.consultas.push(consulta);
  }

  async actualizar(consulta: Consulta): Promise<void> {
    const index = this.consultas.findIndex(c => c.id === consulta.id);
    if (index === -1) {
      throw new Error("Consulta no encontrada");
    }
    this.consultas[index] = consulta;
  }

  async eliminar(id: string): Promise<void> {
    this.consultas = this.consultas.filter(c => c.id !== id);
  }
}