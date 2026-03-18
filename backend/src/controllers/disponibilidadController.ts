import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../config/database";

export const obtenerDisponibilidad = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const { tutorId } = req.params;

        const disponibilidades = await prisma.disponibilidad.findMany({
            where: { tutorId, activo: true },
            orderBy: { diaSemana: "asc", horaInicio: "asc" },
        });

        res.json(disponibilidades);
    } catch (error: any) {
        console.error("Error al obtener disponibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const crearDisponibilidad = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const tutorId = req.usuario!.id;

        const tutor = await prisma.tutor.findUnique({ where: { id: tutorId } });
        if (!tutor) {
            res.status(404).json({ error: "Tutor no encontrado" });
            return;
        }

        const disponibilidad = await prisma.disponibilidad.create({
            data: {
                tutorId,
                diaSemana: req.body.diaSemana,
                horaInicio: req.body.horaInicio,
                horaFin: req.body.horaFin,
                activo: true,
            },
        });

        res.status(201).json(disponibilidad);
    } catch (error: any) {
        console.error("Error al crear disponibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
