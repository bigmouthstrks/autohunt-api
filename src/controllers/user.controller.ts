import { Request, Response } from "express";
import { prisma } from "../config/database";

class UserController {
  // Obtener todos los usuarios
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Obtener un usuario por ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear un nuevo usuario
  async createUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: user,
        message: "Usuario creado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Actualizar un usuario
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      res.json({
        success: true,
        data: user,
        message: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Eliminar un usuario
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new UserController();
