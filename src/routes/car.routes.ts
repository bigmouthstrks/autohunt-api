import { Router } from "express";
import carController from "../controllers/car.controller";

const router = Router();

// Rutas para autos
router.get("/", carController.getAllCars.bind(carController));
router.get("/:id", carController.getCarById.bind(carController));
router.post("/", carController.createCar.bind(carController));
router.put("/:id", carController.updateCar.bind(carController));
router.delete("/:id", carController.deleteCar.bind(carController));

export default router;
