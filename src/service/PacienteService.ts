import { PacientesRepository } from "../data/PacientesRepository";
import { Paciente } from "../models/Paciente";

export class PacientesService {
  private repository = new PacientesRepository();

  async listar(): Promise<Paciente[]> {
    return await this.repository.obtenerPacientes();
  }

  async crear(paciente: Paciente): Promise<void> {
    const pacientes = await this.repository.obtenerPacientes();

    const existe = pacientes.some(p => p.id === paciente.id);

    if (existe) {
      throw new Error("Ya existe un paciente con ese ID.");
    }

    if (paciente.edad < 0) {
      throw new Error("La edad no puede ser negativa.");
    }

    pacientes.push(paciente);
    await this.repository.guardarPacientes(pacientes);
  }

  async buscar(id: number): Promise<Paciente | undefined> {
    const pacientes = await this.repository.obtenerPacientes();

    return pacientes.find(p => p.id === id);
  }

  async actualizar(paciente: Paciente): Promise<void> {
    const pacientes = await this.repository.obtenerPacientes();
    const indice = pacientes.findIndex(p => p.id === paciente.id);

    if (indice === -1) {
      throw new Error("No existe un paciente con ese ID.");
    }

    if (paciente.edad < 0) {
      throw new Error("La edad no puede ser negativa.");
    }

    pacientes[indice] = paciente;

    await this.repository.guardarPacientes(pacientes);
  }

  async eliminar(id: number): Promise<void> {
    const pacientes = await this.repository.obtenerPacientes();
    const nuevos = pacientes.filter(p => p.id !== id);

    if (nuevos.length === pacientes.length) {
      throw new Error("No se encontró ningún paciente para eliminar.");
    }

    await this.repository.guardarPacientes(nuevos);
  }

  async buscarPorNombre(nombre: string): Promise<Paciente | undefined> {
    const pacientes = await this.repository.obtenerPacientes();

    return pacientes.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  }
}