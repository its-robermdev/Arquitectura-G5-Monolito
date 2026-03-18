import { Router } from "express";
import {
    cancelarReserva,
    crearReserva,
    listarMisReservas,
} from "../controllers/reservasController";
import { verificarToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", verificarToken, crearReserva);
router.get("/mis-reservas", verificarToken, listarMisReservas);
router.patch("/:id/cancelar", verificarToken, cancelarReserva);

export default router;