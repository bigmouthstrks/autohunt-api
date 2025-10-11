import { Router } from "express";
import modelController from "../controllers/model.controller";

const router = Router();

// Rutas para modelos
router.get("/", modelController.getAllModels.bind(modelController));
router.get("/:id", modelController.getModelById.bind(modelController));
router.post("/", modelController.createModel.bind(modelController));
router.put("/:id", modelController.updateModel.bind(modelController));
router.delete("/:id", modelController.deleteModel.bind(modelController));

export default router;
