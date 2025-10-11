import { Request, Response } from "express";

class HealthController {
  // Health check endpoint
  async healthCheck(_: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: "🚀 API AutoHunt funcionando correctamente",
      data: {
        service: "AutoHunt API",
        version: "1.0.0",
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      },
    });
  }

  // Readiness check
  async readinessCheck(_: Request, res: Response) {
    try {
      // Aquí puedes agregar verificaciones adicionales
      // Por ejemplo: verificar conexión a la base de datos
      return res.status(200).json({
        success: true,
        status: "ready",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        status: "not ready",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Liveness check
  async livenessCheck(_: Request, res: Response) {
    return res.status(200).json({
      success: true,
      status: "alive",
      timestamp: new Date().toISOString(),
    });
  }
}

export default new HealthController();
