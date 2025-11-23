import { Request, Response } from "express";
import { prisma } from "../config/database";
import type { Maintenance, Workshop, MaintenanceType } from "@prisma/client";

type WorkshopPayload = {
  name?: string;
  address?: string;
};

const formatMaintenance = (
  maintenance: Maintenance & { workshop: Workshop }
) => ({
  id: maintenance.id,
  title: maintenance.title,
  description: maintenance.description,
  type: maintenance.type,
  date: maintenance.date.toISOString(),
  createdAt: maintenance.createdAt.toISOString(),
  updatedAt: maintenance.updatedAt.toISOString(),
  workshop: {
    id: maintenance.workshop.id,
    name: maintenance.workshop.name,
    address: maintenance.workshop.address,
  },
});

class MaintenanceController {
  // Obtener todas las mantenciones del usuario autenticado
  async getAllMaintenances(req: Request, res: Response) {
    try {
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const maintenances = await prisma.maintenance.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        include: { workshop: true },
      });

      return res.status(200).json({
        success: true,
        data: {
          items: maintenances.map(formatMaintenance),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener mantenciones",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Obtener una mantención por ID
  async getMaintenanceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const maintenance = await prisma.maintenance.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
        include: { workshop: true },
      });

      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: "Mantención no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: formatMaintenance(maintenance),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener mantención",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear una nueva mantención
  async createMaintenance(req: Request, res: Response) {
    try {
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const { title, date, description, type, workshop } = req.body as {
        title?: string;
        date?: string;
        description?: string;
        type?: string;
        workshop?: WorkshopPayload;
      };

      if (
        !title ||
        !date ||
        !type ||
        !workshop?.name ||
        !workshop?.address
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Faltan campos requeridos: title, date, type, workshop (name, address)",
        });
      }

      // Validar que la fecha sea válida
      const maintenanceDate = new Date(date);
      if (isNaN(maintenanceDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Fecha inválida",
        });
      }

      const trimmedName = workshop.name.trim();
      const trimmedAddress = workshop.address.trim();

      if (!["REPAIR", "MAINTENANCE", "PART_CHANGE"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Tipo de mantención inválido",
        });
      }

      const existingWorkshop = await prisma.workshop.findFirst({
        where: {
          name: trimmedName,
          address: trimmedAddress,
        },
      });

      const selectedWorkshop =
        existingWorkshop ??
        (await prisma.workshop.create({
          data: { name: trimmedName, address: trimmedAddress },
        }));

      const maintenance = await prisma.maintenance.create({
        data: {
          title,
          date: maintenanceDate,
          description: description?.trim() || null,
          type: type as MaintenanceType,
          userId,
          workshopId: selectedWorkshop.id,
        },
        include: { workshop: true },
      });

      return res.status(201).json({
        success: true,
        data: formatMaintenance(maintenance),
        message: "Mantención creada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al crear mantención",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Actualizar una mantención
  async updateMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la mantención pertenezca al usuario
      const existing = await prisma.maintenance.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
        include: { workshop: true },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Mantención no encontrada",
        });
      }

      const { title, date, description, type, workshop } = req.body as {
        title?: string;
        date?: string;
        description?: string;
        type?: string;
        workshop?: WorkshopPayload;
      };
      const updateData: any = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (date !== undefined) {
        const maintenanceDate = new Date(date);
        if (isNaN(maintenanceDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Fecha inválida",
          });
        }
        updateData.date = maintenanceDate;
      }
      if (type !== undefined) {
        if (!["REPAIR", "MAINTENANCE", "PART_CHANGE"].includes(type)) {
          return res.status(400).json({
            success: false,
            message: "Tipo de mantención inválido",
          });
        }
        updateData.type = type as MaintenanceType;
      }

      const maintenance = await prisma.maintenance.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: { workshop: true },
      });

      if (workshop && (workshop.name || workshop.address)) {
        await prisma.workshop.update({
          where: { id: maintenance.workshopId },
          data: {
            name: workshop.name?.trim() ?? maintenance.workshop.name,
            address: workshop.address?.trim() ?? maintenance.workshop.address,
          },
        });
        maintenance.workshop = await prisma.workshop.findUniqueOrThrow({
          where: { id: maintenance.workshopId },
        });
      }

      return res.status(200).json({
        success: true,
        data: formatMaintenance(maintenance),
        message: "Mantención actualizada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar mantención",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Eliminar una mantención
  async deleteMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la mantención pertenezca al usuario
      const existing = await prisma.maintenance.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Mantención no encontrada",
        });
      }

      await prisma.maintenance.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: "Mantención eliminada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar mantención",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new MaintenanceController();

