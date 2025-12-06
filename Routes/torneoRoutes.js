import { Router } from "express";
import { actualizarFase, agregarFase, crearTorneo, eliminarFase, eliminarTorneo, generarEliminacion, getTorneoId, getTorneos } from "../Controllers/torneos.controller.js";

const router = Router();

router.get("/", getTorneos)
router.get("/:id", getTorneoId)
router.post("/", crearTorneo);
router.post("/:id/fases", agregarFase);
router.put("/:torneoId/fases/:faseId", actualizarFase);
router.post("/:torneoId/fases/:faseId/eliminacion", generarEliminacion);
router.delete("/:torneoId/fases/:faseId", eliminarFase);
router.delete("/:id", eliminarTorneo);

export default router;