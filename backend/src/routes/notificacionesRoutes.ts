import { Router } from "express";
import {
    marcarNotificacionLeida,
    obtenerNoLeidas,
    obtenerMisNotificaciones,
} from "../controllers/notificacionesController";
import { verificarToken } from "../middlewares/authMiddleware";
import { notificacionIdParamSchema } from "../validators/schemas";
import { validateParams } from "../validators/validate";

const router = Router();

router.get("/", verificarToken, obtenerMisNotificaciones);
router.get("/no-leidas", verificarToken, obtenerNoLeidas);
router.patch(
    "/:id/leida",
    verificarToken,
    validateParams(notificacionIdParamSchema),
    marcarNotificacionLeida
);

export default router;