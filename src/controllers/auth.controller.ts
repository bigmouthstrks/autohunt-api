import { Request, Response } from "express";
import { prisma } from "../config/database";
import { AppError, sendError } from "../utils/errors";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";

const userSelect = {
  id: true,
  name: true,
  email: true,
  countryId: true,
  createdAt: true,
  updatedAt: true,
};

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { password, ...rest } = req.body;
      const user = await prisma.user.create({
        data: {
          ...rest,
          password: await hashPassword(password),
        },
        select: userSelect,
      });

      const token = signToken({ userId: user.id, email: user.email });

      res.status(201).json({
        success: true,
        data: { user, token },
        message: "Usuario registrado exitosamente",
      });
    } catch (error) {
      sendError(res, error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await comparePassword(password, user.password))) {
        throw new AppError(401, "Credenciales inválidas");
      }

      const token = signToken({ userId: user.id, email: user.email });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            countryId: user.countryId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token,
        },
        message: "Inicio de sesión exitoso",
      });
    } catch (error) {
      sendError(res, error);
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userSelect,
      });

      if (!user) {
        throw new AppError(404, "Usuario no encontrado");
      }

      res.json({ success: true, data: user });
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default new AuthController();
