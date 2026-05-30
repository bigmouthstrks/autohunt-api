import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  const chile = await prisma.country.upsert({
    where: { code: "CHL" },
    update: {},
    create: { name: "Chile", code: "CHL" },
  });

  const toyota = await prisma.brand.upsert({
    where: { name_countryId: { name: "Toyota", countryId: chile.id } },
    update: {},
    create: { name: "Toyota", countryId: chile.id },
  });

  await prisma.model.upsert({
    where: { brandId_name: { brandId: toyota.id, name: "Corolla" } },
    update: {},
    create: { name: "Corolla", brandId: toyota.id },
  });

  await prisma.vehicleType.upsert({
    where: { name: "Sedan" },
    update: {},
    create: { name: "Sedan", description: "Automóvil de turismo" },
  });

  const maintenanceTypes = [
    { name: "Cambio de aceite", description: "Reemplazo de aceite y filtro" },
    { name: "Revisión de frenos", description: "Inspección del sistema de frenos" },
    { name: "Rotación de neumáticos", description: "Rotación y balanceo" },
  ];

  for (const type of maintenanceTypes) {
    await prisma.maintenanceType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  await prisma.user.upsert({
    where: { email: "demo@autohunt.dev" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "demo@autohunt.dev",
      password: await hashPassword("demo12345"),
      countryId: chile.id,
    },
  });

  console.log("✅ Seed completado");
}

main()
  .catch((error) => {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
