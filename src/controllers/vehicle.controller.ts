import { Request, Response } from "express";
import { prisma } from "../config/database";
import { parseIdParam, sendError } from "../utils/errors";
import { getOwnedVehicle } from "../utils/ownership";

class VehicleController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await prisma.vehicle.findMany({
        where: { userId: req.user!.userId },
      });
      res.json({ success: true, data });
    } catch (error) {
      sendError(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIdParam(req.params.id);
      const data = await getOwnedVehicle(id, req.user!.userId);
      res.json({ success: true, data });
    } catch (error) {
      sendError(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await prisma.vehicle.create({
        data: { ...req.body, userId: req.user!.userId },
      });

      res.status(201).json({
        success: true,
        data,
        message: "Vehículo creado exitosamente",
      });
    } catch (error) {
      sendError(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIdParam(req.params.id);
      await getOwnedVehicle(id, req.user!.userId);

      const { userId: _userId, ...data } = req.body;
      const result = await prisma.vehicle.update({
        where: { id },
        data,
      });

      res.json({
        success: true,
        data: result,
        message: "Vehículo actualizado exitosamente",
      });
    } catch (error) {
      sendError(res, error);
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIdParam(req.params.id);
      await getOwnedVehicle(id, req.user!.userId);
      await prisma.vehicle.delete({ where: { id } });

      res.json({
        success: true,
        message: "Vehículo eliminado exitosamente",
      });
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default new VehicleController();
