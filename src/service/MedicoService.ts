import { Medico } from "../models/Medico";
import { CitasService } from "./CitasService";

export class MedicosService {
  private medicos: Medico[] = [];
  private citasService: CitasService;

  constructor(citasService: CitasService) {
    this.citasService = citasService;
  }

  async listar(): Promise<Medico[]> {
    return this.medicos;
  }

  async buscar(id: number): Promise<Medico | undefined> {
    return this.medicos.find(m => m.id === id);
  }

  async crear(medico: Medico): Promise<void> {
    this.medicos.push(medico);
  }

  async actualizar(medico: Medico): Promise<void> {
    const index = this.medicos.findIndex(m => m.id === medico.id);
    if (index === -1) {
      throw new Error("Medico no encontrado");
    }
    this.medicos[index] = medico;
  }

  async eliminar(id: number): Promise<void> {
    const citasMedico = await this.citasService.reportePorMedico(id);
    const tienePendientes = citasMedico.some(
      c => c.estado === "PENDIENTE" || c.estado === "CONFIRMADA"
    );

    if (tienePendientes) {
      throw new Error("No se puede eliminar un médico con citas pendientes o confirmadas");
    }

    this.medicos = this.medicos.filter(m => m.id !== id);
  }
}