import { IncomingMessage, ServerResponse } from "node:http";
import { CitasService } from "../service/CitasService";

const service = new CitasService();

export async function routerCita(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url.startsWith("/citas/reporte/medico/")) {
      const medicoId = Number(url.split("/")[4]);
      const reporte = await service.reportePorMedico(medicoId);
      res.writeHead(200);
      res.end(JSON.stringify(reporte));
      return;
    }

    if (metodo === "GET" && url.startsWith("/citas/reporte/especialidad/")) {
      const especialidad = decodeURIComponent(url.split("/")[4]);
      const reporte = await service.reportePorEspecialidad(especialidad);
      res.writeHead(200);
      res.end(JSON.stringify(reporte));
      return;
    }

    if (metodo === "GET" && url === "/citas/reporte/inasistencias") {
      const reporte = await service.reporteInasistencias();
      res.writeHead(200);
      res.end(JSON.stringify(reporte));
      return;
    }

    if (metodo === "PUT" && url.startsWith("/citas/confirmar/")) {
      const id = Number(url.split("/")[3]);
      await service.confirmarCita(id);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Cita confirmada exitosamente" }));
      return;
    }

    if (metodo === "PUT" && url.startsWith("/citas/reprogramar/")) {
      const id = Number(url.split("/")[3]);
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", async () => {
        try {
          const { nuevaFechaHoraInicio, nuevaFechaHoraFinal } = JSON.parse(body);
          await service.reprogramarCita(id, nuevaFechaHoraInicio, nuevaFechaHoraFinal);
          res.writeHead(200);
          res.end(JSON.stringify({ message: "Cita reprogramada correctamente" }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: (error as Error).message }));
        }
      });
      return;
    }

    if (metodo === "GET" && url === "/citas") {
      const citas = await service.listar();
      res.writeHead(200);
      res.end(JSON.stringify(citas));
      return;
    }

    if (metodo === "POST" && url === "/citas/post") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", async () => {
        try {
          const cita = JSON.parse(body);
          await service.crear(cita);
          res.writeHead(201);
          res.end(JSON.stringify({ mensaje: "cita agregada" }));
        } catch (error) {
          res.writeHead(409);
          res.end(JSON.stringify({ mensaje: (error as Error).message }));
        }
      });
      return;
    }

    if (metodo === "GET" && url.startsWith("/citas/")) {
      const id = Number(url.split("/")[2]);
      const cita = await service.buscar(id);
      if (!cita) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "cita no encontrada" }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(cita));
      return;
    }

    if (metodo === "DELETE" && url.startsWith("/citas/")) {
      const id = Number(url.split("/")[2]);
      await service.eliminar(id);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Cita eliminada correctamente" }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ mensaje: (error as Error).message }));
  }
}