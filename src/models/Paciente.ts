type Sangre = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type Genero = "Masculino" | "Femenino"

export interface  Paciente{
    id: number
    nombre: string,
    apellido: string
    edad: number,
    genero: Genero,
    dpi: string,
    email: string,
    telefono:string,
    direccion: string
    tipoSangre: Sangre
}