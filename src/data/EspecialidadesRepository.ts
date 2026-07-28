import { readFile, writeFile } from "fs/promises";
import { Especialidad } from "../models/Especialidad";

export class EspecialidadesRepository {
  private ruta = "./src/data/especialidades.json";

  async obtenerEspecialidades(): Promise<Especialidad[]> {
    try {
      const data = await readFile(this.ruta, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async guardarEspecialidades(especialidades: Especialidad[]): Promise<void> {
    try {
      await writeFile(this.ruta, JSON.stringify(especialidades, null, 4));
    } catch (error) {
      console.log("Error al guardar");
      throw error;
    }
  }
}