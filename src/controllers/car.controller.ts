import { Request, Response } from "express";
import { prisma } from "../config/database";

class CarController {
  // Obtener todos los autos
  async getAllCars(req: Request, res: Response) {
    try {
      const cars = await prisma.car.findMany();
      res.json({
        success: true,
        data: cars,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener autos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Obtener un auto por ID
  async getCarById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const car = await prisma.car.findUnique({
        where: { id: parseInt(id) },
      });

      if (!car) {
        return res.status(404).json({
          success: false,
          message: "Auto no encontrado",
        });
      }

      res.json({
        success: true,
        data: car,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener auto",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear un nuevo auto
  async createCar(req: Request, res: Response) {
    try {
      const car = await prisma.car.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: car,
        message: "Auto creado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear auto",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Actualizar un auto
  async updateCar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const car = await prisma.car.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      res.json({
        success: true,
        data: car,
        message: "Auto actualizado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar auto",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Eliminar un auto
  async deleteCar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.car.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Auto eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar auto",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new CarController();
