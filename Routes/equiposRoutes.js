import { Router } from "express";
import { getEquipos, getEquiposId, crearEquipo, actualizarEquipo, eliminarEquipo, getDelegadoEquipo, inscribirEquipo } from "../Controllers/equipos.controller.js";

const router = Router();

router.get("/", getEquipos);
router.get("/:id", getEquiposId);
router.get("/delegado/:delegadoId", getDelegadoEquipo);
router.post("/", crearEquipo);
router.put("/:id", actualizarEquipo);
router.put('/:id/inscribir', inscribirEquipo);
router.delete("/:id", eliminarEquipo);

export default router;