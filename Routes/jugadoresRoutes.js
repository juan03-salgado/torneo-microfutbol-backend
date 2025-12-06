import { Router } from "express";
import { getJugadores, getJugadorId, crearJugador, actualizarJugador, eliminarJugador, getPorEquipo, getEstado, subirFoto, subirDocumento, validarJugador, rechazoJugador} from "../Controllers/jugadores.controller.js";
import { upload } from "../Middlewares/upload.js";

const router = Router();

router.get("/", getJugadores);
router.get("/equipo/:equipoId", getPorEquipo);
router.get("/estado/:estado", getEstado);
router.get("/:id", getJugadorId);
router.post("/", upload.fields([{ name: "foto", maxCount: 1 }, { name: "documentos", maxCount: 5 }]),crearJugador);
router.put("/:id", upload.fields([{ name: "foto", maxCount: 1 }, { name: "documentos", maxCount: 5 }]), actualizarJugador);
router.delete("/:id", eliminarJugador);
router.post("/:id/foto", upload.single("foto"), subirFoto);
router.post("/:id/documentos", upload.array("documentos", 5), subirDocumento);
router.put("/:id/validar", validarJugador);
router.put("/:id/rechazar", rechazoJugador);

export default router;