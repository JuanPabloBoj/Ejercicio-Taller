import { EspecialidadesRepository } from "../data/EspecialidadesRepository";
import { Especialidad } from "../models/Especialidad";

export class EspecialidadesService {
  private repository = new EspecialidadesRepository();

  async listar(): Promise<Especialidad[]> {
    return await this.repository.obtenerEspecialidades();
  }

  async crear(especialidad: Especialidad): Promise<void> {
    const especialidades = await this.repository.obtenerEspecialidades();

    const existe = especialidades.some(e => e.id === especialidad.id);

    if (existe) {
      throw new Error("Ya existe una especialidad con ese ID.");
    }

    if (especialidad.tiempoDuracionMinutos <= 0) {
      throw new Error("La duración debe ser mayor a cero.");
    }

    especialidades.push(especialidad);
    await this.repository.guardarEspecialidades(especialidades);
  }

  async buscar(id: number): Promise<Especialidad | undefined> {
    const especialidades = await this.repository.obtenerEspecialidades();

    return especialidades.find(e => e.id === id);
  }

  async actualizar(especialidad: Especialidad): Promise<void> {
    const especialidades = await this.repository.obtenerEspecialidades();
    const indice = especialidades.findIndex(e => e.id === especialidad.id);

    if (indice === -1) {
      throw new Error("No existe una especialidad con ese ID.");
    }

    if (especialidad.tiempoDuracionMinutos <= 0) {
      throw new Error("La duración debe ser mayor a cero.");
    }

    especialidades[indice] = especialidad;

    await this.repository.guardarEspecialidades(especialidades);
  }

  async eliminar(id: number): Promise<void> {
    const especialidades = await this.repository.obtenerEspecialidades();
    const nuevos = especialidades.filter(e => e.id !== id);

    if (nuevos.length === especialidades.length) {
      throw new Error("No se encontró ninguna especialidad para eliminar.");
    }

    await this.repository.guardarEspecialidades(nuevos);
  }

  async buscarPorNombre(nombre: string): Promise<Especialidad | undefined> {
    const especialidades = await this.repository.obtenerEspecialidades();

    return especialidades.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
  }
}