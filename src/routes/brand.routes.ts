import { Router } from "express";
import brandController from "../controllers/brand.controller";

const router = Router();

// Rutas para marcas
router.get("/", brandController.getAllBrands.bind(brandController));
router.get("/:id", brandController.getBrandById.bind(brandController));
router.post("/", brandController.createBrand.bind(brandController));
router.put("/:id", brandController.updateBrand.bind(brandController));
router.delete("/:id", brandController.deleteBrand.bind(brandController));

export default router;
