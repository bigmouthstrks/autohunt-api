import { Request, Response } from "express";
import { prisma } from "../config/database";

class WorkshopController {
  async getAllWorkshops(_: Request, res: Response) {
    try {
      const workshops = await prisma.workshop.findMany({
        orderBy: { name: "asc" },
      });
      return res.status(200).json({
        success: true,
        data: workshops,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener talleres",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async getWorkshopById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workshop = await prisma.workshop.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: "Taller no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: workshop,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener taller",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async createWorkshop(req: Request, res: Response) {
    try {
      const { name, address } = req.body as { name?: string; address?: string };

      if (!name || !address) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos requeridos: name, address",
        });
      }

      const workshop = await prisma.workshop.create({
        data: { name, address },
      });

      return res.status(201).json({
        success: true,
        data: workshop,
        message: "Taller creado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al crear taller",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new WorkshopController();

