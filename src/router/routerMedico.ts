import { IncomingMessage, ServerResponse } from "node:http";
import { MedicosService } from "../service/MedicoService";
import { CitasService } from "../service/CitasService";

const citasService = new CitasService();
const service = new MedicosService(citasService);

export async function routerMedico(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url === "/medicos") {
      const medicos = await service.listar();
      res.writeHead(200);
      res.end(JSON.stringify(medicos));
      return;
    }

    if (metodo === "POST" && url === "/medicos/post") {
      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const medico = JSON.parse(body);
          await service.crear(medico);

          res.writeHead(201);
          res.end(JSON.stringify({
            mensaje: "medico agregado"
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

    if (metodo === "GET" && url.startsWith("/medicos/")) {
      const id = Number(url.split("/")[2]);
      const medico = await service.buscar(id);

      if (!medico) {
        res.writeHead(404);
        res.end(JSON.stringify({
          message: "medico no encontrado"
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(medico));
      return;
    }

    if (metodo === "PUT" && url.startsWith("/medicos/")) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const medico = JSON.parse(body);
          await service.actualizar(medico);

          res.writeHead(200);
          res.end(JSON.stringify({
            message: "medico actualizado correctamente"
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

    if (metodo === "DELETE" && url.startsWith("/medicos/")) {
      const id = Number(url.split("/")[2]);
      await service.eliminar(id);

      res.writeHead(200);
      res.end(JSON.stringify({
        message: "Medico eliminado correctamente"
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