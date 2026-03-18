import app from "./app";
import prisma from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        //Verificar conexion
        await prisma.$connect();
        console.log("✅ Conexión a la base de datos exitosa");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`❤️ Health: http://localhost:${PORT}/health`);
            console.log(`🔗 API: https://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar:", error);
        process.exit(1);
    }
};

//Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGNTERM recibido, cerrando servidor...");
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT recibido, cerrando servidor...");
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
