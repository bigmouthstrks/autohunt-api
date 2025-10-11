import { Request, Response } from "express";
import { prisma } from "../config/database";

class ModelController {
  // Obtener todos los modelos
  async getAllModels(_: Request, res: Response) {
    try {
      const models = await prisma.model.findMany();
      return res.status(200).json({
        success: true,
        data: models,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener modelos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Obtener un modelo por ID
  async getModelById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const model = await prisma.model.findUnique({
        where: { id: parseInt(id) },
      });

      if (!model) {
        return res.status(404).json({
          success: false,
          message: "Modelo no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: model,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener modelo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear un nuevo modelo
  async createModel(req: Request, res: Response) {
    try {
      const model = await prisma.model.create({
        data: req.body,
      });

      return res.status(201).json({
        success: true,
        data: model,
        message: "Modelo creado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al crear modelo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Actualizar un modelo
  async updateModel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const model = await prisma.model.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      return res.status(200).json({
        success: true,
        data: model,
        message: "Modelo actualizado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar modelo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Eliminar un modelo
  async deleteModel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.model.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: "Modelo eliminado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar modelo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new ModelController();
