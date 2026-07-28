import { createServer, Server as HttpServer } from "node:http";
import { routerMedico } from "../router/routerMedico";
import { routerPaciente } from "../router/routerPaciente";
import { routerEspecialidad } from "../router/routerEspecialidad";
import { routerHorario } from "../router/routerHorario";
import { routerCita } from "../router/routerCita";
import { routerConsulta } from "../router/routerConsulta";

export class Server {
  private server: HttpServer;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;

    this.server = createServer(async (req, res) => {
      const url = req.url ?? "";

      if (url.startsWith("/medicos")) {
        await routerMedico(req, res);
        return;
      }

      if (url.startsWith("/pacientes")) {
        await routerPaciente(req, res);
        return;
      }

      if (url.startsWith("/especialidades")) {
        await routerEspecialidad(req, res);
        return;
      }

      if (url.startsWith("/horarios")) {
        await routerHorario(req, res);
        return;
      }

      if (url.startsWith("/citas")) {
        await routerCita(req, res);
        return;
      }

      if (url.startsWith("/consultas")) {
        await routerConsulta(req, res);
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ mensaje: "Recurso no encontrado" }));
    });
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log("\n---------------------");
      console.log(`Servidor Iniciado en el puerto ${this.port}`);
      console.log(`http://localhost:${this.port}`);
      console.log("---------------------");
    });
  }
}