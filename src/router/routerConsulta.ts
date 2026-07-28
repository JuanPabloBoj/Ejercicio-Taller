import { IncomingMessage, ServerResponse } from "node:http";
import { ConsultasService } from "../service/ConsultasService";
import { CitasService } from "../service/CitasService";

const citasService = new CitasService();
const service = new ConsultasService(citasService);

export async function routerConsulta(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url === "/consultas") {
      const consultas = await service.listar();
      res.writeHead(200);
      res.end(JSON.stringify(consultas));
      return;
    }

    if (metodo === "POST" && url === "/consultas/post") {
      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const consulta = JSON.parse(body);
          await service.crear(consulta);

          res.writeHead(201);
          res.end(JSON.stringify({
            mensaje: "consulta agregada"
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

    if (metodo === "GET" && url.startsWith("/consultas/")) {
      const id = url.split("/")[2];
      const consulta = await service.buscar(id);

      if (!consulta) {
        res.writeHead(404);
        res.end(JSON.stringify({
          message: "consulta no encontrada"
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(consulta));
      return;
    }

    if (metodo === "PUT" && url.startsWith("/consultas/")) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const consulta = JSON.parse(body);
          await service.actualizar(consulta);

          res.writeHead(200);
          res.end(JSON.stringify({
            message: "consulta actualizada correctamente"
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

    if (metodo === "DELETE" && url.startsWith("/consultas/")) {
      const id = url.split("/")[2];
      await service.eliminar(id);

      res.writeHead(200);
      res.end(JSON.stringify({
        message: "Consulta eliminada correctamente"
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