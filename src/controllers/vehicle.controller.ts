import { Request, Response } from "express";
import { prisma } from "../config/database";
import type { Vehicle } from "@prisma/client";

const formatVehicle = (vehicle: Vehicle) => ({
  id: vehicle.id,
  brand: vehicle.brand,
  model: vehicle.model,
  year: vehicle.year,
  mileage: vehicle.mileage,
  alias: vehicle.alias,
  userId: vehicle.userId,
  createdAt: vehicle.createdAt.toISOString(),
  updatedAt: vehicle.updatedAt.toISOString(),
});

class VehicleController {
  // Obtener todos los vehículos del usuario autenticado
  async getAllVehicles(_: Request, res: Response) {
    try {
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const vehicles = await prisma.vehicle.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        data: vehicles.map(formatVehicle),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener vehículos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Obtener un vehículo por ID
  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const vehicle = await prisma.vehicle.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehículo no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: formatVehicle(vehicle),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener vehículo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear un nuevo vehículo
  async createVehicle(req: Request, res: Response) {
    try {
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const { brand, model, year, mileage, alias } = req.body as {
        brand?: string;
        model?: string;
        year?: number;
        mileage?: number;
        alias?: string;
      };

      // Validar campos requeridos
      if (!brand || !model || !year || mileage === undefined || !alias) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos requeridos: brand, model, year, mileage, alias",
        });
      }

      // Validar que brand y model no estén vacíos
      const trimmedBrand = brand.trim();
      const trimmedModel = model.trim();
      const trimmedAlias = alias.trim();

      if (!trimmedBrand || !trimmedModel || !trimmedAlias) {
        return res.status(400).json({
          success: false,
          message: "brand, model y alias no pueden estar vacíos",
        });
      }

      // Validar año (1900 hasta año actual)
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        return res.status(400).json({
          success: false,
          message: `El año debe estar entre 1900 y ${currentYear}`,
        });
      }

      // Validar kilometraje (>= 0)
      if (mileage < 0) {
        return res.status(400).json({
          success: false,
          message: "El kilometraje debe ser mayor o igual a 0",
        });
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          brand: trimmedBrand,
          model: trimmedModel,
          year,
          mileage,
          alias: trimmedAlias,
          userId,
        },
      });

      return res.status(201).json({
        success: true,
        data: formatVehicle(vehicle),
        message: "Vehículo creado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al crear vehículo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Actualizar un vehículo
  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      // Verificar que el vehículo pertenezca al usuario
      const existing = await prisma.vehicle.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Vehículo no encontrado",
        });
      }

      const { brand, model, year, mileage, alias } = req.body as {
        brand?: string;
        model?: string;
        year?: number;
        mileage?: number;
        alias?: string;
      };

      const updateData: any = {};

      if (brand !== undefined) {
        const trimmedBrand = brand.trim();
        if (!trimmedBrand) {
          return res.status(400).json({
            success: false,
            message: "brand no puede estar vacío",
          });
        }
        updateData.brand = trimmedBrand;
      }

      if (model !== undefined) {
        const trimmedModel = model.trim();
        if (!trimmedModel) {
          return res.status(400).json({
            success: false,
            message: "model no puede estar vacío",
          });
        }
        updateData.model = trimmedModel;
      }

      if (year !== undefined) {
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
          return res.status(400).json({
            success: false,
            message: `El año debe estar entre 1900 y ${currentYear}`,
          });
        }
        updateData.year = year;
      }

      if (mileage !== undefined) {
        if (mileage < 0) {
          return res.status(400).json({
            success: false,
            message: "El kilometraje debe ser mayor o igual a 0",
          });
        }
        updateData.mileage = mileage;
      }

      if (alias !== undefined) {
        const trimmedAlias = alias.trim();
        if (!trimmedAlias) {
          return res.status(400).json({
            success: false,
            message: "alias no puede estar vacío",
          });
        }
        updateData.alias = trimmedAlias;
      }

      const vehicle = await prisma.vehicle.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        data: formatVehicle(vehicle),
        message: "Vehículo actualizado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar vehículo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Eliminar un vehículo
  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      // Verificar que el vehículo pertenezca al usuario
      const existing = await prisma.vehicle.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Vehículo no encontrado",
        });
      }

      await prisma.vehicle.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: "Vehículo eliminado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar vehículo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new VehicleController();