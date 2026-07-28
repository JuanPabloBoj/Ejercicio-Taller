import { readFile, writeFile } from "fs/promises";
import { Paciente } from "../models/Paciente";

export class PacientesRepository {
  private ruta = "./src/data/pacientes.json";

  async obtenerPacientes(): Promise<Paciente[]> {
    try {
      const data = await readFile(this.ruta, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async guardarPacientes(pacientes: Paciente[]): Promise<void> {
    try {
      await writeFile(this.ruta, JSON.stringify(pacientes, null, 4));
    } catch (error) {
      console.log("Error al guardar");
      throw error;
    }
  }
}