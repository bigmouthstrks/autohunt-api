import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

// Función para conectar a la base de datos
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a la base de datos PostgreSQL");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

// Función para desconectar de la base de datos
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  console.log("Desconectado de la base de datos");
};
