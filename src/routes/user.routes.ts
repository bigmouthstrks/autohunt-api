import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Rutas para usuarios
// Públicas
router.post("/login", userController.login.bind(userController));
router.post("/", userController.createUser.bind(userController));

// Protegidas
router.use(authMiddleware);
router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
