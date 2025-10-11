import dotenv from "dotenv";
import app from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Manejar cierre graceful
process.on("SIGINT", async () => {
  console.log("\n👋 Cerrando servidor...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n👋 Cerrando servidor...");
  await disconnectDatabase();
  process.exit(0);
});

// Iniciar la aplicación
startServer();
