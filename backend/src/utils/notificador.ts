interface Notificacion {
    id: number;
    destinatario: string;
    tipo: string;
    asunto: string;
    mensaje: string;
    fechaEnvio: Date;
    leida: boolean;
}

class NotificadorSimulado {
    private historial: Notificacion[] = [];
    private contadorId = 1;

    enviarNotificacion(
        destinatario: string,
        tipo: string,
        asunto: string,
        mensaje: string
    ): Notificacion {
        const notificacion: Notificacion = {
            id: this.contadorId++,
            destinatario,
            tipo,
            asunto,
            mensaje,
            fechaEnvio: new Date(),
            leida: false,
        };

        this.historial.push(notificacion);

        console.log(`[${tipo.toUpperCase()}] Notificacion enviada a ${destinatario}`);
        console.log(`Asunto: ${asunto}`);
        console.log(`Mensaje: ${mensaje}`);
        console.log(`Fecha: ${notificacion.fechaEnvio.toISOString()}`);

        return notificacion;
    }

    obtenerHistorial(): Notificacion[] {
        return [...this.historial];
    }

    obtenerPorUsuario(usuarioId: string): Notificacion[] {
        return this.historial.filter(
            (notificacion) => notificacion.destinatario === usuarioId
        );
    }

    marcarLeida(notificacionId: number): boolean {
        const notificacion = this.historial.find((n) => n.id === notificacionId);
        if (notificacion) {
            notificacion.leida = true;
            return true;
        }
        return false;
    }

    obtenerNoLeidas(usuarioId: string): Notificacion[] {
        return this.historial.filter(
            (notificacion) =>
                notificacion.destinatario === usuarioId && !notificacion.leida
        );
    }
}

const notificador = new NotificadorSimulado();

export default notificador;