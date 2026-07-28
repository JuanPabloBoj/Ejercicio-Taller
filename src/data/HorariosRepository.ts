import { readFile, writeFile } from "fs/promises";
import { Horario } from "../models/Horario";

export class HorariosRepository {
  private ruta = "./src/data/horarios.json";

  async obtenerHorarios(): Promise<Horario[]> {
    try {
      const data = await readFile(this.ruta, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async guardarHorarios(horarios: Horario[]): Promise<void> {
    try {
      await writeFile(this.ruta, JSON.stringify(horarios, null, 4));
    } catch (error) {
      console.log("Error al guardar");
      throw error;
    }
  }
}