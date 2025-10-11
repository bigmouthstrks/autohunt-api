import { Router } from "express";
import healthController from "../controllers/health.controller";

const router = Router();

// Rutas de health check
router.get("/", healthController.healthCheck.bind(healthController));
router.get("/ready", healthController.readinessCheck.bind(healthController));
router.get("/live", healthController.livenessCheck.bind(healthController));

export default router;
