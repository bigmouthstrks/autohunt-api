import { Request, Response } from "express";
import { prisma } from "../config/database";

class BrandController {
  // Obtener todas las marcas
  async getAllBrands(_: Request, res: Response) {
    try {
      const brands = await prisma.brand.findMany();
      return res.status(200).json({
        success: true,
        data: brands,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener marcas",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Obtener una marca por ID
  async getBrandById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const brand = await prisma.brand.findUnique({
        where: { id: parseInt(id) },
      });

      if (!brand) {
        return res.status(404).json({
          success: false,
          message: "Marca no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener marca",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear una nueva marca
  async createBrand(req: Request, res: Response) {
    try {
      const brand = await prisma.brand.create({
        data: req.body,
      });

      return res.status(201).json({
        success: true,
        data: brand,
        message: "Marca creada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al crear marca",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Actualizar una marca
  async updateBrand(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const brand = await prisma.brand.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      return res.status(200).json({
        success: true,
        data: brand,
        message: "Marca actualizada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar marca",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Eliminar una marca
  async deleteBrand(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.brand.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        success: true,
        message: "Marca eliminada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar marca",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new BrandController();
