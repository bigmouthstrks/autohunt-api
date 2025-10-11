import { Router } from "express";
import healthRoutes from "./health.routes";
import userRoutes from "./user.routes";
import carRoutes from "./car.routes";
import modelRoutes from "./model.routes";
import brandRoutes from "./brand.routes";

const router = Router();

// Registrar todas las rutas con sus prefijos
router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/cars", carRoutes);
router.use("/models", modelRoutes);
router.use("/brands", brandRoutes);

export default router;
