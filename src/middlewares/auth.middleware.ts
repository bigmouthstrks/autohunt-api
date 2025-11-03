import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

// Define rutas públicas que no requieren autenticación
const PUBLIC_ROUTES: { method: string; pathStartsWith: string }[] = [
  { method: "GET", pathStartsWith: "/api/health" },
  { method: "POST", pathStartsWith: "/api/users" }, // registro
  { method: "POST", pathStartsWith: "/api/users/login" }, // login
];

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Permitir GET "/" sin autenticación
  if (req.method === "GET" && (req.path === "/" || req.originalUrl === "/")) {
    return next();
  }

  const isPublic = PUBLIC_ROUTES.some(
    (r) => r.method === req.method && req.path.startsWith(r.pathStartsWith)
  );

  if (isPublic) {
    return next();
  }

  const authHeader = req.headers["authorization"] as string | undefined;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Token no provisto" });
  }

  const token = authHeader.substring("Bearer ".length);
  try {
    const payload = verifyToken(token);
    // Guardar en res.locals para acceso posterior en handlers
    res.locals.user = payload;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token inválido o expirado" });
  }
}
