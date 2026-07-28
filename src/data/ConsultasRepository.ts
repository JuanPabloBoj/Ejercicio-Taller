import { readFile, writeFile } from "fs/promises";
import { Consulta } from "../models/Consulta";

export class ConsultasRepository {
  private ruta = "./src/data/consultas.json";

  async obtenerConsultas(): Promise<Consulta[]> {
    try {
      const data = await readFile(this.ruta, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async guardarConsultas(consultas: Consulta[]): Promise<void> {
    try {
      await writeFile(this.ruta, JSON.stringify(consultas, null, 4));
    } catch (error) {
      console.log("Error al guardar");
      throw error;
    }
  }
}