import { readFile, writeFile } from "fs/promises";
import { Cita } from "../models/Cita";

export class CitasRepository {
  private ruta = "./src/data/citas.json";

  async obtenerCitas(): Promise<Cita[]> {
    try {
      const data = await readFile(this.ruta, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async guardarCitas(citas: Cita[]): Promise<void> {
    try {
      await writeFile(this.ruta, JSON.stringify(citas, null, 4));
    } catch (error) {
      console.log("Error al guardar");
      throw error;
    }
  }
}