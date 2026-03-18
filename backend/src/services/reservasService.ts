import prisma from "../config/database";
import notificador from "../utils/notificador";

type CrearReservaData = {
    estudianteId: string;
    tutorId: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
};

class ReservasService {
    async crearReserva(data: CrearReservaData) {
        const ahora = new Date();
        const hoyStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
        if (data.fecha < hoyStr) {
            throw new Error("No se pueden crear reservas para fechas pasadas");
        }

        const tutor = await prisma.tutor.findUnique({
            where: { id: data.tutorId },
            include: { usuario: true },
        });

        if (!tutor) {
            throw new Error("Tutor no encontrado");
        }

        const reservaExistente = await prisma.reserva.findFirst({
            where: {
                tutorId: data.tutorId,
                fecha: new Date(data.fecha),
                estado: "confirmada",
                OR: [
                    {
                        AND: [
                            { horaInicio: { lte: data.horaInicio } },
                            { horaFin: { gt: data.horaInicio } },
                        ],
                    },
                    {
                        AND: [
                            { horaInicio: { lt: data.horaFin } },
                            { horaFin: { gte: data.horaFin } },
                        ],
                    },
                    {
                        AND: [
                            { horaInicio: { gte: data.horaInicio } },
                            { horaFin: { lte: data.horaFin } },
                        ],
                    },
                ],
            },
        });

        if (reservaExistente) {
            throw new Error("El tutor ya tiene una reserva confirmada en ese horario");
        }

        const [anio, mes, dia] = data.fecha.split("-").map(Number);
        const fechaLocal = new Date(anio, mes - 1, dia);
        const diaSemana = fechaLocal.getDay() || 7;

        const disponibilidad = await prisma.disponibilidad.findFirst({
            where: {
                tutorId: data.tutorId,
                diaSemana,
                activo: true,
                horaInicio: { lte: data.horaInicio },
                horaFin: { gte: data.horaFin },
            },
        });

        if (!disponibilidad) {
            throw new Error("El tutor no esta disponible en ese horario");
        }

        const reserva = await prisma.reserva.create({
            data: {
                estudianteId: data.estudianteId,
                tutorId: data.tutorId,
                fecha: new Date(data.fecha),
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                estado: "confirmada",
            },
            include: {
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
                tutor: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        notificador.enviarNotificacion(
            data.estudianteId,
            "email",
            "Reserva confirmada",
            `Tu reserva con ${tutor.usuario.nombre} para el ${data.fecha} de ${data.horaInicio} a ${data.horaFin} ha sido confirmada.`
        );

        notificador.enviarNotificacion(
            data.tutorId,
            "email",
            "Nueva reserva recibida",
            `Tienes una reserva para el ${data.fecha} de ${data.horaInicio} a ${data.horaFin}.`
        );

        return reserva;
    }

    async cancelarReserva(reservaId: string, usuarioId: string) {
        const reserva = await prisma.reserva.findUnique({
            where: { id: reservaId },
            include: {
                tutor: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                            },
                        },
                    },
                },
            },
        });

        if (!reserva) {
            throw new Error("Reserva no encontrada");
        }

        if (reserva.estudianteId !== usuarioId && reserva.tutorId !== usuarioId) {
            throw new Error("No tienes permiso para cancelar esta reserva");
        }

        const reservaCancelada = await prisma.reserva.update({
            where: { id: reservaId },
            data: { estado: "cancelada" },
        });

        const destinoNotificacion =
            reserva.estudianteId === usuarioId ? reserva.tutorId : reserva.estudianteId;

        notificador.enviarNotificacion(
            destinoNotificacion,
            "email",
            "Reserva cancelada",
            `La reserva del ${reserva.fecha.toISOString().slice(0, 10)} de ${reserva.horaInicio} a ${reserva.horaFin} fue cancelada.`
        );

        return reservaCancelada;
    }

    async listarReservasPorUsuario(id: string, rol: string) {
        if (rol !== "estudiante" && rol !== "tutor") {
            throw new Error("Rol no valido para listar reservas");
        }

        const where = rol === "estudiante" ? { estudianteId: id } : { tutorId: id };

        return prisma.reserva.findMany({
            where,
            orderBy: [{ fecha: "desc" }, { horaInicio: "desc" }],
            include: {
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
                tutor: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }
}

const reservasService = new ReservasService();

export default reservasService;