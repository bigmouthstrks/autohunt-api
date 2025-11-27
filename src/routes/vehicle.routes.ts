import { Router } from "express";
import vehicleController from "../controllers/vehicle.controller";

const router = Router();

// Todas las rutas de vehículos requieren autenticación
// El authMiddleware ya está aplicado globalmente en app.ts
// pero las rutas públicas están excluidas, así que estas rutas están protegidas

router.get("/", vehicleController.getAllVehicles.bind(vehicleController));
router.get("/:id", vehicleController.getVehicleById.bind(vehicleController));
router.post("/", vehicleController.createVehicle.bind(vehicleController));
router.put("/:id", vehicleController.updateVehicle.bind(vehicleController));
router.delete("/:id", vehicleController.deleteVehicle.bind(vehicleController));

export default router;