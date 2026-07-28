import { IncomingMessage, ServerResponse } from "node:http";
import { PacientesService } from "../service/PacienteService";

const service = new PacientesService();

export async function routerPaciente(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url === "/pacientes") {
      const pacientes = await service.listar();
      res.writeHead(200);
      res.end(JSON.stringify(pacientes));
      return;
    }

    if (metodo === "POST" && url === "/pacientes/post") {
      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const paciente = JSON.parse(body);
          await service.crear(paciente);

          res.writeHead(201);
          res.end(JSON.stringify({
            mensaje: "paciente agregado"
          }));
        } catch (error) {
          res.writeHead(409);
          res.end(JSON.stringify({
            mensaje: (error as Error).message
          }));
        }
      });
      return;
    }

    if (metodo === "GET" && url.startsWith("/pacientes/")) {
      const id = Number(url.split("/")[2]);
      const paciente = await service.buscar(id);

      if (!paciente) {
        res.writeHead(404);
        res.end(JSON.stringify({
          message: "paciente no encontrado"
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(paciente));
      return;
    }

    if (metodo === "PUT" && url.startsWith("/pacientes/")) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const paciente = JSON.parse(body);
          await service.actualizar(paciente);

          res.writeHead(200);
          res.end(JSON.stringify({
            message: "paciente actualizado correctamente"
          }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({
            message: (error as Error).message
          }));
        }
      });

      return;
    }

    if (metodo === "DELETE" && url.startsWith("/pacientes/")) {
      const id = Number(url.split("/")[2]);
      await service.eliminar(id);

      res.writeHead(200);
      res.end(JSON.stringify({
        message: "Paciente eliminado correctamente"
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({
      message: "Ruta no encontrada"
    }));

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      mensaje: (error as Error).message
    }));
  }
}