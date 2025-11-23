import { Router } from "express";
import workshopController from "../controllers/workshop.controller";

const router = Router();

router.get("/", workshopController.getAllWorkshops.bind(workshopController));
router.get("/:id", workshopController.getWorkshopById.bind(workshopController));
router.post("/", workshopController.createWorkshop.bind(workshopController));

export default router;

