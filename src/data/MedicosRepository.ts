import { readFile, writeFile } from "fs/promises";
import { Medico } from "../models/Medico";

export class MedicosRepository{

    private ruta = "./src/data/medicos.json";

    async obtenerMedicos(): Promise <Medico[]>{
        try {
            const data = await readFile(this.ruta, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return[];
        }
    }

    async guardarMedico(medicos: Medico[]): Promise<void>{
        try {
            await writeFile(this.ruta, JSON.stringify(medicos, null, 4));
        } catch (error) {
            console.log("Error al guardar");
            throw error;
        }
    }
}