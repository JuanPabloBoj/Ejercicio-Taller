import { Especialidad } from "./Especialidad";

export type Estado = "ACTIVO" | "SUSPENDIDO" | "RETIRADO";

export interface Medico{
    id:number,
    nombre:string,
    apellido:string,
    numColegiado: string,
    email:string,
    telefono:string,
    especialidad: Especialidad,
    estado: Estado
}