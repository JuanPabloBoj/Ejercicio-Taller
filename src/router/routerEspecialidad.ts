import { IncomingMessage, ServerResponse } from "node:http";
import { EspecialidadesService } from "../service/EspecialidadesService";

const service = new EspecialidadesService();

export async function routerEspecialidad(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url === "/especialidades") {
      const especialidades = await service.listar();
      res.writeHead(200);
      res.end(JSON.stringify(especialidades));
      return;
    }

    if (metodo === "POST" && url === "/especialidades/post") {
      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const especialidad = JSON.parse(body);
          await service.crear(especialidad);

          res.writeHead(201);
          res.end(JSON.stringify({
            mensaje: "especialidad agregada"
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

    if (metodo === "GET" && url.startsWith("/especialidades/")) {
      const id = Number(url.split("/")[2]);
      const especialidad = await service.buscar(id);

      if (!especialidad) {
        res.writeHead(404);
        res.end(JSON.stringify({
          message: "especialidad no encontrada"
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(especialidad));
      return;
    }

    if (metodo === "PUT" && url.startsWith("/especialidades/")) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const especialidad = JSON.parse(body);
          await service.actualizar(especialidad);

          res.writeHead(200);
          res.end(JSON.stringify({
            message: "especialidad actualizada correctamente"
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

    if (metodo === "DELETE" && url.startsWith("/especialidades/")) {
      const id = Number(url.split("/")[2]);
      await service.eliminar(id);

      res.writeHead(200);
      res.end(JSON.stringify({
        message: "Especialidad eliminada correctamente"
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