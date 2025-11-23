import { Router } from "express";
import maintenanceController from "../controllers/maintenance.controller";

const router = Router();

// Todas las rutas de mantención requieren autenticación
// El authMiddleware ya está aplicado globalmente en app.ts
// pero las rutas públicas están excluidas, así que estas rutas están protegidas

router.get("/", maintenanceController.getAllMaintenances.bind(maintenanceController));
router.get("/:id", maintenanceController.getMaintenanceById.bind(maintenanceController));
router.post("/", maintenanceController.createMaintenance.bind(maintenanceController));
router.put("/:id", maintenanceController.updateMaintenance.bind(maintenanceController));
router.delete("/:id", maintenanceController.deleteMaintenance.bind(maintenanceController));

export default router;

