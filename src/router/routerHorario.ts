import { IncomingMessage, ServerResponse } from "node:http";
import { HorariosService } from "../service/HorariosService";

const service = new HorariosService();

export async function routerHorario(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url.startsWith("/horarios/disponibles")) {
      const parsedUrl = new URL(url, `http://${req.headers.host}`);
      const medicoId = Number(parsedUrl.searchParams.get("medicoId"));
      const fecha = parsedUrl.searchParams.get("fecha") ?? "";

      const disponibles = await service.obtenerDisponibles(medicoId, fecha);
      res.writeHead(200);
      res.end(JSON.stringify(disponibles));
      return;
    }

    if (metodo === "GET" && url === "/horarios") {
      const horarios = await service.listar();
      res.writeHead(200);
      res.end(JSON.stringify(horarios));
      return;
    }

    if (metodo === "POST" && url === "/horarios/post") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", async () => {
        try {
          const horario = JSON.parse(body);
          await service.crear(horario);
          res.writeHead(201);
          res.end(JSON.stringify({ mensaje: "horario agregado" }));
        } catch (error) {
          res.writeHead(409);
          res.end(JSON.stringify({ mensaje: (error as Error).message }));
        }
      });
      return;
    }

    if (metodo === "GET" && url.startsWith("/horarios/")) {
      const id = url.split("/")[2];
      const horario = await service.buscar(id);
      if (!horario) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "horario no encontrado" }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(horario));
      return;
    }

    if (metodo === "DELETE" && url.startsWith("/horarios/")) {
      const id = url.split("/")[2];
      await service.eliminar(id);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Horario eliminado correctamente" }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ mensaje: (error as Error).message }));
  }
}