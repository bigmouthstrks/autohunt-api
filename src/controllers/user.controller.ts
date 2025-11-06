import { Request, Response } from "express";
import { prisma } from "../config/database";
import { hashPassword, verifyPassword, signToken } from "../utils/auth";

class UserController {
  // Obtener todos los usuarios
  async getAllUsers(_: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
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

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Crear un nuevo usuario
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
      };

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos requeridos",
        });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Email ya registrado" });
      }

      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: { name, email, password: hashed },
      });

      const { password: _pwd, ...userSafe } = user;
      return res.status(201).json({
        success: true,
        data: userSafe,
        message: "Usuario creado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
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

      const { password: _pwd, ...userSafe } = user;
      return res.status(200).json({
        success: true,
        data: userSafe,
        message: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
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

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Login de usuario
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email y contraseña requeridos" });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Credenciales inválidas" });
      }

      const ok = await verifyPassword(password, user.password);
      if (!ok) {
        return res
          .status(401)
          .json({ success: false, message: "Credenciales inválidas" });
      }

      const token = signToken({ userId: user.id, email: user.email });
      const { password: _pwd, ...userSafe } = user;
      return res.status(200).json({ success: true, token, data: userSafe });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al iniciar sesión",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export default new UserController();
